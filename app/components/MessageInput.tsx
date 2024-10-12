"use client";

import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { useChat } from "../providers/ChatProvider";

export default function MessageInput() {
  const { isLoading, addMessage, stopBotMessage } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage(inputMessage.trim());
      setInputMessage("");
      resetTextareaHeight();
    }
  };

  const handleButtonClick = () => {
    if (isLoading) {
      stopBotMessage();
    } else {
      handleSendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        handleSendMessage();
        resetTextareaHeight();
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [inputMessage]);

  return (
    <div className="tw-bg-gray-400 tw-rounded-xl tw-border tw-border-border tw-p-2 tw-shadow-sm tw-flex tw-flex-row tw-items-end tw-gap-2">
      <textarea
        ref={textareaRef}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className={classNames(
          "tw-bg-inherit tw-flex-grow tw-p-2 tw-resize-none tw-overflow-scroll tw-min-h-0 tw-max-h-[10em] focus:tw-outline-none",
          "placeholder:tw-text-gray-500"
        )}
        placeholder="How can Mistral help you today?"
        rows={1}
      />
      <button
        onClick={handleButtonClick}
        className={classNames(
          "tw-p-2 tw-bg-orange-500 tw-text-white tw-rounded tw-hover:bg-orange-600 tw-transition-colors tw-duration-200",
          "disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
        )}
        disabled={!isLoading && !inputMessage.trim()}
      >
        {isLoading ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-square"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 3m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-send"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10 14l11 -11" />
            <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
          </svg>
        )}
      </button>
    </div>
  );
}
