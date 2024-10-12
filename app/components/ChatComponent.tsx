"use client";

import { useState, useRef } from "react";
import MessageInput from "./MessageInput";

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, sender: "user" },
    ]);
    setIsLoading(true);

    // Simulate a delay before the bot responds
    timeoutRef.current = setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Hello world", sender: "bot" },
      ]);
      setIsLoading(false);
    }, 1500); // 1.5 seconds delay
  };

  const stopBotMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsLoading(false);
    }
  };

  return (
    <div className="tw-flex tw-flex-col tw-h-full">
      <div className="tw-flex-1 tw-overflow-y-auto tw-p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className="tw-mb-2 tw-p-2 tw-bg-gray-400 tw-rounded-xl tw-break-words"
          >
            {message.sender === "user" ? "You: " : "Bot: "}
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="tw-mb-2 tw-p-2 tw-bg-gray-400 tw-rounded-xl tw-break-words">
            Bot: <span className="tw-animate-pulse">Thinking...</span>
          </div>
        )}
      </div>
      <MessageInput
        addMessage={addMessage}
        isLoading={isLoading}
        stopBotMessage={stopBotMessage}
      />
    </div>
  );
}
