import React, { useState } from "react";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import UserProfile from "./UserProfile";

function Dashboard() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activePage, setActivePage] = useState("chats");

  return (
    <div className="flex h-[calc(100vh-48px)] w-full bg-orange-50">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="w-full max-w-sm">
        <ChatList
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          activePage={activePage}
        />
      </div>

      <div className="flex-1">
        {activePage === "profile" ? (
          <UserProfile
            onBack={() => setActivePage("chats")}
          />
        ) : (
          <ChatWindow selectedChat={selectedChat} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;