"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const key = localStorage.getItem("apiKey");
    if (key) {
      setApiKey(key);
    }
  }, []);

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("apiKey", key);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey: handleSetApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
};
