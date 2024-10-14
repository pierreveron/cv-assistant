import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { Message } from "../utils/types";
import { Model, streamResponse } from "../utils/mistralai";
import { useApiKey } from "./ApiKeyProvider";

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

  const addMessage = useCallback(
    async (message: string) => {
      if (!apiKey) {
        console.error("No API key found");
        alert("Add an API key in the sidebar to start chatting.");
        return;
      }
      const newUserMessage = { text: message, sender: "user" } as Message;
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setIsLoading(true);

      setCurrentStreamedMessage("");
      let accumulatedMessage = "";

      try {
        abortControllerRef.current = new AbortController();
        const stream = streamResponse([...messages, newUserMessage], {
          apiKey: apiKey,
          abortSignal: abortControllerRef.current.signal,
          model: currentModel,
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
        if (error instanceof InvalidApiKeyError) {
          alert(
            "The API key you provided is invalid. Please update it in the sidebar and try again."
          );
        } else {
          alert("An error occurred on the server side. Please try again.");
        }
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
    [messages, apiKey, currentModel]
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
