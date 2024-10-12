"use client";

import { useState, useRef } from "react";
import MessageInput from "./MessageInput";
import classNames from "classnames";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Text copied to clipboard");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  return (
    <div className="tw-flex tw-flex-col tw-h-full">
      <div className="tw-flex-1 tw-overflow-y-auto tw-p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={classNames(
              "tw-mb-2 tw-p-2 tw-bg-gray-400 tw-rounded-xl tw-break-words",
              message.sender === "bot" && "tw-flex tw-items-start tw-gap-2"
            )}
          >
            <div className="tw-flex-grow">
              {message.sender === "user" ? "You: " : "Bot: "}
              {message.text}
            </div>
            {message.sender === "bot" && (
              <button
                onClick={() => copyToClipboard(message.text)}
                className="tw-p-1 tw-rounded hover:tw-bg-gray-500 tw-transition-colors"
                title="Copy message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-copy"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                  <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
                </svg>
              </button>
            )}
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
