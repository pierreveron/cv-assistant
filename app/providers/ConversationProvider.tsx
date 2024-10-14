"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Message } from "../utils/types";
import { useRouter } from "next/navigation";

interface Conversation {
  id: string;
  title: string;
}

interface ConversationContextType {
  conversations: Conversation[];
  createConversation: () => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
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

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Load conversations from localStorage when the component mounts (client-side only)
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations));
  }, [conversations]);

  const createConversation = useCallback(() => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: "New chat",
    };
    setConversations((prev) => [...prev, newConversation]);
    router.push(`/c/${newId}`);
  }, [router]);

  const updateConversation = useCallback(
    (id: string, updates: Partial<Conversation>) => {
      setConversations((prev) =>
        prev.map((conv) => (conv.id === id ? { ...conv, ...updates } : conv))
      );
    },
    []
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      router.push("/");
      localStorage.removeItem(`messages_${id}`);
    },
    [router]
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
        conversations,
        createConversation,
        updateConversation,
        deleteConversation,
        updateConversationMessages,
        getConversationMessages,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
