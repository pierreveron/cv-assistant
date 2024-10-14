"use client";

import React, { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import { useChat } from "../providers/ChatProvider";

const PlaceholderQuestions = ({
  onQuestionClick,
}: {
  onQuestionClick: (question: string) => void;
}) => {
  const placeholderQuestions = [
    "How does this chatbot work?",
    "Why is Pierre Véron a great fit for Mistral?",
    "Where can I find more of Pierre's projects?",
  ];

  return (
    <div className="tw-flex tw-flex-row tw-gap-2 tw-mb-2 tw-w-full">
      {placeholderQuestions.map((question, index) => (
        <div
          key={index}
          onClick={() => onQuestionClick(question)}
          className={classNames(
            "tw-bg-gray-100 tw-text-gray-700 tw-px-3 tw-py-2 tw-rounded-lg tw-text-sm tw-cursor-pointer tw-transition-colors tw-duration-200",
            "hover:tw-bg-gray-200",
            "dark:tw-bg-gray-700 dark:tw-text-gray-300 dark:hover:tw-bg-gray-600"
          )}
        >
          {question}
        </div>
      ))}
    </div>
  );
};

export default function MessageInput() {
  const { isLoading, addMessage, stopBotMessage, messages } = useChat();

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

  const handleQuestionClick = (question: string) => {
    addMessage(question);
  };

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-full tw-max-w-[80%] tw-mx-auto">
      {messages.length === 0 && (
        <PlaceholderQuestions onQuestionClick={handleQuestionClick} />
      )}

      <div
        className={classNames(
          "tw-rounded-xl tw-border tw-border-border tw-p-2 tw-shadow-sm tw-w-full tw-flex tw-flex-row tw-items-end tw-gap-2",
          "tw-bg-white tw-border-gray-200",
          "dark:tw-bg-gray-800 dark:tw-border-gray-700"
        )}
      >
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={classNames(
            "tw-bg-inherit tw-flex-grow tw-p-2 tw-resize-none tw-overflow-scroll tw-min-h-0 tw-max-h-[10em] focus:tw-outline-none",
            "tw-text-gray-900",
            "dark:tw-text-white"
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
    </div>
  );
}
