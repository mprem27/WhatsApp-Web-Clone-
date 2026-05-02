import React, { useEffect, useState } from "react";
import {
  MoreVertical,
  Search,
  LogOut,
  Settings,
  UserPlus,
} from "lucide-react";
import { Assets } from "../assets/Assets";
import {
  getAllUsers,
  searchUsers,
  getUserProfile,
} from "../services/userService";
import { logoutUser } from "../services/authService";

const SELECTED_CHAT_KEY = "whatsapp_clone_selected_chat";

function ChatList({ selectedChat, onSelectChat, activePage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeChat, setActiveChat] = useState("");
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState([]);
  const [profileUser, setProfileUser] = useState(null);

  const formatUsers = (users = []) =>
    users.map((user) => ({
      id: user._id,
      name: user.fullName || user.username || "Unknown User",
      message: user.about || "Hey there! I am using WhatsApp Web Clone.",
      time: user.isOnline ? "Online" : "Offline",
      image:
        user.profileImage &&
        typeof user.profileImage === "string" &&
        user.profileImage.trim() !== ""
          ? user.profileImage
          : Assets.profile,
      user,
    }));

  const syncSelectedChatFromStorage = (formattedChats) => {
    try {
      const savedChat = localStorage.getItem(SELECTED_CHAT_KEY);
      if (!savedChat) return;

      const parsedChat = JSON.parse(savedChat);
      const matchedChat = formattedChats.find(
        (chat) => chat.id === parsedChat._id
      );

      if (matchedChat) {
        setActiveChat(matchedChat.id);
        onSelectChat?.(matchedChat.user);
      }
    } catch (error) {
      console.error("Failed to restore selected chat:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      const users = data?.users || [];
      const formattedChats = formatUsers(users);

      setChats(formattedChats);
      syncSelectedChatFromStorage(formattedChats);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setChats([]);
    }
  };

  const fetchProfileData = async () => {
    try {
      const response = await getUserProfile();
      if (response?.success) {
        setProfileUser(response.user);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProfileData();
  }, []);

  useEffect(() => {
    const handleSearch = async () => {
      try {
        if (!search.trim()) {
          fetchUsers();
          return;
        }

        const data = await searchUsers(search);
        const users = data?.users || [];
        setChats(formatUsers(users));
      } catch (error) {
        console.error("Search failed:", error);
      }
    };

    const delay = setTimeout(handleSearch, 300);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (selectedChat?._id) {
      setActiveChat(selectedChat._id);
      localStorage.setItem(SELECTED_CHAT_KEY, JSON.stringify(selectedChat));
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleStorageSync = () => {
      try {
        const savedChat = localStorage.getItem(SELECTED_CHAT_KEY);

        if (!savedChat) {
          setActiveChat("");
          return;
        }

        const parsedChat = JSON.parse(savedChat);
        setActiveChat(parsedChat._id);
      } catch {
        setActiveChat("");
      }
    };

    const refreshProfile = () => {
      fetchProfileData();
      fetchUsers();
    };

    window.addEventListener("storage", handleStorageSync);
    window.addEventListener("chatUpdated", handleStorageSync);
    window.addEventListener("profileUpdated", refreshProfile);

    return () => {
      window.removeEventListener("storage", handleStorageSync);
      window.removeEventListener("chatUpdated", handleStorageSync);
      window.removeEventListener("profileUpdated", refreshProfile);
    };
  }, []);

  const handleChatSelect = (chat) => {
    setActiveChat(chat.id);
    localStorage.setItem(SELECTED_CHAT_KEY, JSON.stringify(chat.user));
    window.dispatchEvent(new Event("chatUpdated"));
    onSelectChat?.(chat.user);
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem(SELECTED_CHAT_KEY);
    window.location.reload();
  };

  if (activePage === "profile") {
    return (
      <section className="flex h-full w-full flex-col bg-[#FFF8F2]/85 px-6 py-6 backdrop-blur-md">
        <div className="border-b border-orange-100 pb-5">
          <h2 className="text-2xl font-bold tracking-wide text-gray-950">
            Profile
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-600">
            You can update your personal data
          </p>
        </div>

        {profileUser && (
          <div className="mt-8 flex flex-col items-center">
            <img
              src={profileUser.profileImage || Assets.profile}
              alt="Profile"
              onError={(e) => {
                e.currentTarget.src = Assets.profile;
              }}
              className="h-24 w-24 rounded-full border-4 border-orange-100 object-cover shadow-sm"
            />
            <h3 className="mt-4 text-lg font-bold text-gray-950">
              {profileUser.fullName}
            </h3>
            <p className="mt-1 text-sm font-semibold text-orange-600">
              @{profileUser.username}
            </p>
            <p className="mt-4 text-center text-sm font-medium leading-6 text-gray-600">
              {profileUser.about}
            </p>
          </div>
        )}
      </section>
    );
  }

  return (
    // FIXED: Removed absolute widths (w-96) to allow Dashboard to control the flex sizing
    <section className="flex h-full w-full flex-col bg-[#FFF8F2]/85 px-5 py-5 backdrop-blur-md">
      <div className="relative flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-wide text-gray-950">
          Chats
        </h2>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-xl p-2 text-gray-800 transition duration-300 hover:bg-orange-100 hover:text-orange-600"
        >
          <MoreVertical size={22} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-11 z-20 w-56 overflow-hidden rounded-2xl border border-orange-100 bg-white py-2 shadow-xl">
            <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-orange-50">
              <UserPlus size={17} />
              New Chat (Coming Soon)
            </button>

            <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-orange-50">
              <Settings size={17} />
              Settings (Future Update)
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-sm transition duration-300 focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search chats"
          className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder:text-gray-500 focus:outline-none"
        />
      </div>

      <div className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => handleChatSelect(chat)}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition duration-300 ${
                activeChat === chat.id
                  ? "bg-orange-200/70 shadow-sm"
                  : "hover:bg-orange-100/80"
              }`}
            >
              <img
                src={chat.image}
                alt={chat.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = Assets.profile;
                }}
                className="h-12 w-12 rounded-full bg-gray-200 object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="truncate text-sm font-bold text-gray-950">
                    {chat.name}
                  </h3>
                  <span className="shrink-0 text-[11px] font-semibold text-gray-500">
                    {chat.time}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs font-medium text-gray-600">
                  {chat.message}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm font-medium text-gray-500">
              No users found
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ChatList;