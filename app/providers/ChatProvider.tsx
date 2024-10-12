import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { Message } from "../utils/types";
import { streamResponse } from "../utils/mistralai";

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  currentStreamedMessage: string;
  addMessage: (message: string) => Promise<void>;
  stopBotMessage: () => void;
  copyToClipboard: (text: string) => void;
  resetChat: () => void;
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

  const addMessage = useCallback(
    async (message: string) => {
      const newUserMessage = { text: message, sender: "user" } as Message;
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setIsLoading(true);

      setCurrentStreamedMessage("");
      let accumulatedMessage = "";

      try {
        abortControllerRef.current = new AbortController();
        const stream = streamResponse([...messages, newUserMessage], {
          abortSignal: abortControllerRef.current.signal,
        });

        for await (const chunk of stream) {
          accumulatedMessage += chunk;
          setCurrentStreamedMessage(accumulatedMessage);
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: accumulatedMessage, sender: "bot" },
        ]);
      } catch (error) {
        console.error("Error generating bot response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "An error occurred on the server side. Please try again.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsLoading(false);
        setCurrentStreamedMessage("");
      }
    },
    [messages]
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
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
