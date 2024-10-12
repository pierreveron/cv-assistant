"use client";

import { useState, useRef } from "react";
import MessageInput from "./MessageInput";
import classNames from "classnames";
import { Message } from "../utils/types";
import { run } from "../utils/mistralai";

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const addMessage = async (message: string) => {
    const newUserMessage = { text: message, sender: "user" } as Message;
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setIsLoading(true);

    try {
      abortControllerRef.current = new AbortController();
      const botResponse = await run([...messages, newUserMessage], {
        abortSignal: abortControllerRef.current.signal,
      });
      if (botResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botResponse, sender: "bot" },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Oups sorry, an error occurred: the generated message is empty. Please try again.",
            sender: "bot",
          },
        ]);
      }
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
    }
  };

  const stopBotMessage = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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
    <div className="tw-flex tw-flex-col tw-h-full tw-w-full tw-max-w-[80%] tw-mx-auto tw-mb-4">
      <div className="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={classNames(
              "tw-flex",
              message.sender === "user" ? "tw-justify-end" : "tw-justify-start"
            )}
          >
            <div className="tw-flex tw-items-end tw-gap-2 tw-max-w-[80%]">
              <div
                className={classNames(
                  "tw-p-3 tw-rounded-2xl",
                  message.sender === "user"
                    ? "tw-bg-gray-400 tw-text-white"
                    : "tw-bg-white tw-text-gray-800"
                )}
              >
                {message.text}
              </div>
              {message.sender === "bot" && (
                <button
                  onClick={() => copyToClipboard(message.text)}
                  className="tw-p-1 tw-rounded hover:tw-bg-gray-200 tw-transition-colors"
                  title="Copy message"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
          </div>
        ))}
        {isLoading && (
          <div className="tw-flex tw-justify-start">
            <div className="tw-p-3 tw-rounded-2xl tw-bg-white tw-text-gray-800">
              <span className="tw-animate-pulse">Thinking...</span>
            </div>
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
