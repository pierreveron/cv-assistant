"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Message } from "../utils/types";
import { usePathname, useRouter } from "next/navigation";

interface ConversationMetadata {
  id: string;
  title: string;
  createdAt: string;
}

interface ConversationContextType {
  currentConversationId: string | null;
  conversations: ConversationMetadata[];
  createConversation: () => string;
  updateConversationTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
  updateConversationMessages: (id: string, messages: Message[]) => void;
  getConversationMessages: (id: string) => Message[];
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
};

const storeConversations = (conversations: ConversationMetadata[]) => {
  localStorage.setItem("conversations", JSON.stringify(conversations));
};

const loadConversations = (): ConversationMetadata[] => {
  const conversations = localStorage.getItem("conversations");
  return conversations ? JSON.parse(conversations) : [];
};

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<ConversationMetadata[]>(
    []
  );
  const router = useRouter();
  const pathname = usePathname();
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const savedConversations = loadConversations();
    setConversations(savedConversations);
  }, []);

  useEffect(() => {
    // Get the conversation ID from the URL path
    const pathParts = pathname.split("/");
    const conversationId = pathParts[pathParts.length - 1];
    setCurrentConversationId(conversationId || null);
  }, [pathname]);

  const createConversation = useCallback(() => {
    const newId = Date.now().toString();

    setConversations((prev) => {
      const newConversation: ConversationMetadata = {
        id: newId,
        title: "New chat",
        createdAt: new Date().toISOString(),
      };
      const newConversations = [...prev, newConversation];
      storeConversations(newConversations);
      return newConversations;
    });

    setCurrentConversationId(newId);
    router.push(`/chat/${newId}`);

    return newId;
  }, [router]);

  const updateConversationTitle = useCallback((id: string, title: string) => {
    setConversations((prev) => {
      const newConversations = prev.map((conv) =>
        conv.id === id ? { ...conv, title } : conv
      );
      storeConversations(newConversations);
      return newConversations;
    });
  }, []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const newConversations = prev.filter((conv) => conv.id !== id);
        storeConversations(newConversations);
        return newConversations;
      });
      if (currentConversationId === id) {
        setCurrentConversationId(null);
        router.push("/");
      }
      localStorage.removeItem(`messages_${id}`);
    },
    [currentConversationId, router]
  );

  const updateConversationMessages = useCallback(
    (id: string, messages: Message[]) => {
      localStorage.setItem(`messages_${id}`, JSON.stringify(messages));
    },
    []
  );

  const getConversationMessages = useCallback((id: string) => {
    const savedMessages = localStorage.getItem(`messages_${id}`);
    if (savedMessages) {
      return JSON.parse(savedMessages);
    }
    return [];
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        currentConversationId,
        conversations,
        createConversation,
        updateConversationTitle,
        deleteConversation,
        updateConversationMessages,
        getConversationMessages,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
