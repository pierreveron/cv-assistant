import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { Message } from "../utils/types";
import { InvalidApiKeyError, Model } from "../utils/mistralai";
import { generateConversationTitle } from "../utils/conversationTitleGeneration";
import { streamBotMessage } from "../utils/botMessageGeneration";
import { useApiKey } from "./ApiKeyProvider";
import { useConversation } from "./ConversationProvider";

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  currentStreamedMessage: string;
  addMessage: (message: string) => Promise<void>;
  stopBotMessage: () => void;
  copyToClipboard: (text: string) => void;
  resetChat: () => void;
  currentModel: Model;
  setModel: (model: Model) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStreamedMessage, setCurrentStreamedMessage] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const [currentModel, setCurrentModel] = useState<Model>(
    "mistral-small-latest"
  );
  const { apiKey } = useApiKey();
  const {
    currentConversationId,
    getConversationMessages,
    updateConversationMessages,
    conversations,
    createConversation,
    updateConversationTitle,
  } = useConversation();

  useEffect(() => {
    if (
      currentConversationId &&
      conversations.some((conv) => conv.id === currentConversationId)
    ) {
      const conversationMessages = getConversationMessages(
        currentConversationId
      );
      setMessages(conversationMessages);
    } else {
      setMessages([]);
    }
  }, [conversations, currentConversationId, getConversationMessages]);

  const addMessage = useCallback(
    async (message: string) => {
      if (!apiKey) {
        console.error("No API key found");
        alert("Add an API key in the sidebar to start chatting.");
        return;
      }
      const newUserMessage = { text: message, sender: "user" } as Message;
      const conversationId = currentConversationId || createConversation();
      const updatedMessages = [...messages, newUserMessage];
      updateConversationMessages(conversationId, updatedMessages);
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      setIsLoading(true);

      setCurrentStreamedMessage("");
      let accumulatedMessage = "";

      try {
        abortControllerRef.current = new AbortController();
        const stream = streamBotMessage([...messages, newUserMessage], {
          apiKey: apiKey,
          abortSignal: abortControllerRef.current.signal,
          model: currentModel,
        });

        for await (const chunk of stream) {
          accumulatedMessage += chunk;
          setCurrentStreamedMessage(accumulatedMessage);
        }

        const botMessage = {
          text: accumulatedMessage,
          sender: "bot",
        } as Message;
        const finalMessages = [...updatedMessages, botMessage];
        updateConversationMessages(conversationId, finalMessages);
        setMessages((prev) => [...prev, botMessage]);

        // Update the conversation title after adding the new message
        const title = await generateConversationTitle(finalMessages, {
          apiKey,
          model: currentModel,
        });

        if (title) {
          updateConversationTitle(conversationId, title);
        }
      } catch (error) {
        if (error instanceof InvalidApiKeyError) {
          alert(
            "The API key you provided is invalid. Please update it in the sidebar and try again."
          );
        } else {
          alert("An error occurred on the server side. Please try again.");
        }
        console.error("Error generating bot response:", error);
        const errorMessage = {
          text: "An error occurred on the server side. Please try again.",
          sender: "bot",
        } as Message;
        updateConversationMessages(conversationId, [
          ...updatedMessages,
          errorMessage,
        ]);
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setCurrentStreamedMessage("");
      }
    },
    [
      apiKey,
      currentConversationId,
      createConversation,
      messages,
      updateConversationMessages,
      currentModel,
      updateConversationTitle,
    ]
  );

  const stopBotMessage = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Text copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setIsLoading(false);
    setCurrentStreamedMessage("");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const setModel = useCallback((model: Model) => {
    setCurrentModel(model);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        currentStreamedMessage,
        addMessage,
        stopBotMessage,
        copyToClipboard,
        resetChat,
        currentModel,
        setModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
