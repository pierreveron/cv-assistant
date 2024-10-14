"use client";

import MessageInput from "./MessageInput";
import MessageBubble from "./MessageBubble";
import Image from "next/image";
import { useChat } from "../providers/ChatProvider";
import Markdown from "react-markdown";
import classNames from "classnames";

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
            <div className="tw-flex tw-justify-start tw-gap-x-2">
              <div
                className={classNames(
                  "tw-inline-flex tw-h-7 tw-w-7 tw-shrink-0 tw-items-center tw-justify-center -tw-ml-3.5 tw-rounded-full",
                  "tw-bg-gray-100 dark:tw-bg-gray-800",
                  "tw-text-gray-500 dark:tw-text-gray-400"
                )}
              >
                <Image
                  src="/logo-mistral.png"
                  alt="Mistral AI Logo"
                  width={24}
                  height={24}
                />
              </div>

              <div className="tw-flex tw-items-end tw-gap-2 tw-max-w-[80%]">
                <div
                  className={classNames(
                    "tw-p-3 tw-rounded-lg",
                    "tw-bg-white tw-text-gray-800 dark:tw-bg-gray-700 dark:tw-text-gray-200"
                  )}
                >
                  {currentStreamedMessage ? (
                    <Markdown>{currentStreamedMessage}</Markdown>
                  ) : (
                    <span className="tw-animate-pulse">Thinking...</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <MessageInput />
    </div>
  );
}
