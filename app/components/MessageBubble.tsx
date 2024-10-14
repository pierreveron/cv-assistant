import React from "react";
import classNames from "classnames";
import Image from "next/image";
import Markdown from "react-markdown";

interface MessageBubbleProps {
  message: {
    sender: "user" | "bot";
    text: string;
  };
  copyToClipboard: (text: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  copyToClipboard,
}) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={classNames(
        "tw-flex tw-gap-x-2",
        isUser ? "tw-justify-end" : "tw-justify-start"
      )}
    >
      {!isUser && (
        <div
          className={classNames(
            "tw-inline-flex tw-h-7 tw-w-7 tw-shrink-0 tw-items-center tw-justify-center -tw-ml-3.5 tw-rounded-full",
            "tw-text-gray-500 tw-bg-gray-100",
            "dark:tw-text-gray-400 dark:tw-bg-gray-800"
          )}
        >
          <Image
            src="/logo-mistral.png"
            alt="Mistral AI Logo"
            width={24}
            height={24}
          />
        </div>
      )}
      <div className="tw-flex tw-items-end tw-gap-2 tw-max-w-[80%]">
        <div
          className={classNames(
            "tw-p-3 tw-rounded-lg",
            isUser
              ? "tw-bg-orange-500 tw-text-white"
              : "tw-bg-gray-100 tw-text-gray-800 dark:tw-bg-gray-800 dark:tw-text-gray-200"
          )}
        >
          <Markdown>{message.text}</Markdown>
        </div>
        {!isUser && (
          <button
            onClick={() => copyToClipboard(message.text)}
            className={classNames(
              "tw-p-1 tw-rounded",
              "hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600",
              "tw-text-gray-500 dark:tw-text-gray-400"
            )}
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
  );
};

export default MessageBubble;
