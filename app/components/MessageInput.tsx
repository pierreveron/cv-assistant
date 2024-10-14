"use client";

import React, { useState, useRef } from "react";
import classNames from "classnames";
import { useChat } from "../providers/ChatProvider";

const PlaceholderQuestions = ({
  onQuestionClick,
}: {
  onQuestionClick: (question: string) => void;
}) => {
  const placeholderQuestions = [
    "Why is Pierre a great fit for Mistral?",
    "Tell me about Pierre's experience with AI",
    "Where can I find more of Pierre's projects?",
  ];

  return (
    <div className="tw-flex tw-flex-col tw-gap-2 tw-mb-4 tw-w-full">
      {placeholderQuestions.map((question, index) => (
        <div
          key={index}
          onClick={() => onQuestionClick(question)}
          className={classNames(
            "tw-bg-gray-100 tw-text-gray-700 tw-px-4 tw-py-3 tw-rounded-lg tw-text-sm tw-cursor-pointer",
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

const Disclaimer = () => (
  <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-mt-2 tw-text-center">
    This AI assistant is a demo created by{" "}
    <a
      href="https://www.linkedin.com/in/pierre-veron/"
      target="_blank"
      rel="noopener noreferrer"
      className="tw-text-orange-500 hover:tw-underline"
    >
      Pierre Véron
    </a>{" "}
    using Mistral AI technology. Responses may not always be accurate.
  </p>
);

export default function MessageInput() {
  const { isLoading, addMessage, stopBotMessage, messages } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160); // 160px is 10em assuming 16px font-size
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY =
        newHeight === 160 ? "auto" : "hidden";
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addMessage(inputMessage.trim());
      setInputMessage("");
      adjustTextareaHeight();
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
        adjustTextareaHeight();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    adjustTextareaHeight();
  };

  const handleQuestionClick = (question: string) => {
    addMessage(question);
  };

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-w-full tw-max-w-[80%] tw-mx-auto">
      {messages.length === 0 && (
        <>
          <h2 className="tw-text-xl tw-font-semibold tw-mb-2 tw-text-center">
            Welcome to Pierre Véron&apos;s CV Assistant
          </h2>
          <p className="tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 tw-mb-4 tw-text-center">
            Ask me anything about Pierre&apos;s skills and experience!
          </p>
          <PlaceholderQuestions onQuestionClick={handleQuestionClick} />
        </>
      )}

      <div
        className={classNames(
          "tw-rounded-xl tw-border tw-border-border tw-p-2 tw-w-full tw-flex tw-flex-row tw-items-end tw-gap-2",
          "tw-bg-white tw-border-gray-200",
          "dark:tw-bg-gray-800 dark:tw-border-gray-700"
        )}
      >
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={classNames(
            "tw-bg-inherit tw-flex-grow tw-resize-none tw-p-2 tw-max-h-[10em] focus:tw-outline-none",
            "tw-text-gray-900",
            "dark:tw-text-white"
          )}
          placeholder="How can Mistral help you today?"
          rows={1}
        />
        <button
          onClick={handleButtonClick}
          className={classNames(
            "tw-p-2 tw-bg-orange-500 tw-text-white tw-rounded tw-hover:bg-orange-600",
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

      <Disclaimer />
    </div>
  );
}
