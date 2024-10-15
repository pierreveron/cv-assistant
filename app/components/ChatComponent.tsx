"use client";

import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import { useChat } from "../providers/ChatProvider";

export default function ChatComponent() {
  const { messages, isLoading, currentStreamedMessage, copyToClipboard } =
    useChat();
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      const lastChild = messageContainerRef.current.lastElementChild;
      lastChild?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamedMessage]);

  return (
    <div className="tw-flex tw-flex-col tw-h-full tw-w-full tw-pb-4">
      <div className="tw-flex-1 tw-overflow-y-auto tw-py-4 tw-space-y-4 tw-w-full">
        <div
          ref={messageContainerRef}
          className="tw-max-w-[80%] tw-mx-auto tw-space-y-4"
        >
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              copyToClipboard={copyToClipboard}
            />
          ))}
          {isLoading && (
            <MessageBubble
              message={{
                sender: "bot",
                text: currentStreamedMessage,
              }}
              copyToClipboard={() => {}}
              isStreaming={true}
            />
          )}
        </div>
      </div>
      <MessageInput />
    </div>
  );
}
