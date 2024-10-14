"use client";

import React, { useEffect, useState } from "react";
import { useConversation } from "../providers/ConversationProvider";
import { useApiKey } from "../providers/ApiKeyProvider";
import classNames from "classnames";
import Link from "next/link";
import { useSidebar } from "../providers/SidebarProvider";

interface ConversationItemProps {
  conversation: {
    id: string;
    title: string;
  };
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
}) => {
  const { deleteConversation, currentConversationId } = useConversation();
  return (
    <Link href={`/chat/${conversation.id}`}>
      <div
        className={classNames(
          "tw-flex tw-justify-between tw-items-center tw-cursor-pointer tw-p-2 tw-rounded",
          "tw-text-gray-800 hover:tw-bg-gray-200",
          "dark:tw-text-gray-200 dark:hover:tw-bg-gray-700",
          {
            "tw-bg-gray-100 dark:tw-bg-gray-600":
              currentConversationId === conversation.id,
          }
        )}
      >
        <p className="tw-truncate">{conversation.title}</p>
        <button
          className={classNames(
            "tw-text-gray-500 hover:tw-text-red-500",
            "dark:tw-text-gray-400 dark:hover:tw-text-red-400"
          )}
          onClick={(e) => {
            e.preventDefault();
            deleteConversation(conversation.id);
          }}
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
            className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </button>
      </div>
    </Link>
  );
};

const ApiKeyInput: React.FC = () => {
  const { apiKey, setApiKey } = useApiKey();
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  useEffect(() => {
    setTempApiKey(apiKey);
  }, [apiKey]);

  return (
    <div
      className={classNames(
        "tw-mt-auto tw-pt-4 tw-px-4 tw-border-t -tw-mx-4",
        "tw-transition-colors tw-duration-300",
        "tw-border-gray-200 dark:tw-border-gray-700"
      )}
    >
      <label
        htmlFor="apiKey"
        className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300"
      >
        Mistral API key
      </label>
      <div className="tw-mt-1 tw-flex">
        <input
          type="text"
          name="apiKey"
          id="apiKey"
          value={tempApiKey}
          onChange={(e) => setTempApiKey(e.target.value)}
          className={classNames(
            "tw-block tw-px-2 tw-py-1 tw-w-full tw-border-y tw-border-l tw-rounded-l-md focus:tw-outline-none tw-text-sm",
            "tw-text-gray-900 tw-bg-white tw-border-gray-300",
            "dark:tw-text-gray-100 dark:tw-bg-gray-800 dark:tw-border-gray-700",
            "focus:tw-ring-orange-500 focus:tw-border-orange-500 dark:focus:tw-ring-orange-400 dark:focus:tw-border-orange-400"
          )}
          placeholder="Enter your key"
        />
        <button
          onClick={() => setApiKey(tempApiKey)}
          className={classNames(
            "tw-inline-flex tw-items-center tw-px-3 tw-py-2 tw-border tw-border-transparent tw-text-sm tw-leading-4 tw-font-medium tw-rounded-r-md tw-text-white",
            "tw-bg-orange-600 hover:tw-bg-orange-700 dark:tw-bg-orange-500 dark:hover:tw-bg-orange-600",
            "focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-orange-500 dark:focus:tw-ring-orange-400",
            "disabled:tw-opacity-50 disabled:tw-cursor-not-allowed disabled:hover:tw-bg-orange-600 dark:disabled:hover:tw-bg-orange-500"
          )}
          disabled={tempApiKey === apiKey}
          title={
            tempApiKey === apiKey ? "API key is already set" : "Save API key"
          }
        >
          Save
        </button>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const { conversations } = useConversation();

  return (
    <div
      className={classNames(
        isSidebarOpen ? "tw-block" : "tw-hidden",
        "tw-w-64 tw-p-4 tw-border-r tw-flex-shrink-0",
        "tw-flex tw-flex-col tw-h-full",
        "tw-transition-colors tw-duration-300",
        "tw-bg-white tw-border-gray-200 tw-text-gray-900",
        "dark:tw-bg-gray-950 dark:tw-border-gray-700 dark:tw-text-gray-200"
      )}
    >
      <h1 className="tw-text-2xl tw-font-bold tw-mb-6 tw-text-left tw-text-orange-500 dark:tw-text-orange-400">
        Pierre Véron&apos;s CV Assistant
      </h1>
      <h2 className="tw-text-lg tw-font-semibold tw-mb-2">Conversations</h2>
      <div className="tw-flex tw-flex-col tw-gap-y-1 tw-flex-grow tw-overflow-y-auto">
        {conversations.length === 0 && (
          <p className="tw-text-gray-500 tw-text-left">
            No conversations yet. Start a new conversation!
          </p>
        )}
        {conversations.map((conversation) => (
          <ConversationItem key={conversation.id} conversation={conversation} />
        ))}
      </div>

      <ApiKeyInput />
    </div>
  );
};

export default Sidebar;
