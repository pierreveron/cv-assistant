"use client";

import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import Image from "next/image";
import { useChat } from "../providers/ChatProvider";
import Markdown from "react-markdown";

export default function ChatComponent() {
  const { messages, isLoading, currentStreamedMessage, copyToClipboard } =
    useChat();

  return (
    <div className="tw-flex tw-flex-col tw-h-full tw-w-full tw-pb-4">
      <div className="tw-flex-1 tw-overflow-y-auto tw-py-4 tw-space-y-4 tw-w-full">
        <div className="tw-max-w-[80%] tw-mx-auto tw-space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              copyToClipboard={copyToClipboard}
            />
          ))}
          {isLoading && (
            <div className="tw-flex tw-justify-start">
              <div className="tw-inline-flex tw-h-7 tw-w-7 tw-shrink-0 tw-items-center tw-justify-center -ml-3.5 tw-bg-background">
                <Image
                  src="/logo-mistral.png"
                  alt="Mistral AI Logo"
                  width={24}
                  height={24}
                />
              </div>
              <div className="tw-p-3 tw-rounded-2xl tw-bg-white tw-text-gray-800">
                {currentStreamedMessage ? (
                  <Markdown>{currentStreamedMessage}</Markdown>
                ) : (
                  <span className="tw-animate-pulse">Thinking...</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <MessageInput />
    </div>
  );
}
