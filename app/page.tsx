import ChatComponent from "./components/ChatComponent";

export default function Home() {
  return (
    <div className="tw-flex tw-flex-col tw-h-screen">
      <h1 className="tw-text-2xl tw-font-bold tw-p-4">Chat App</h1>
      <ChatComponent />
    </div>
  );
}
