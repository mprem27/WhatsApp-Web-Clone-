import React, { useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import UserProfile from "./UserProfile";

function Dashboard() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activePage, setActivePage] = useState("chats");

  return (
    // FIXED: Added pl-16 to push the chat panels to the right, out from under the fixed Sidebar
    <div className="flex h-[calc(100vh-48px)] w-full bg-orange-50 overflow-hidden pl-16">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Panel 1: Chat List */}
      <div className="w-full max-w-sm border-r border-orange-200 bg-white flex flex-col overflow-hidden">
        <ChatList
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          activePage={activePage}
        />
      </div>

      {/* Panel 2: Active Chat Window or Profile */}
      <div className="flex-1 flex h-full min-w-0 flex-col overflow-hidden">
        {activePage === "profile" ? (
          <UserProfile onBack={() => setActivePage("chats")} />
        ) : (
          <ChatWindow selectedChat={selectedChat} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;