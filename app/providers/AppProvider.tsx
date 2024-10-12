"use client";
import React from "react";
import { ChatProvider } from "./ChatProvider";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatProvider>{children}</ChatProvider>;
}
