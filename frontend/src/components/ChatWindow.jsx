import React, { useEffect, useRef, useState, useCallback } from "react";
import { MoreVertical, Info, Trash2, Send, AlertTriangle } from "lucide-react";
import { Assets } from "../assets/Assets";
import { getMessages, sendMessage, deleteChat } from "../services/messageService";
import { getStoredUser } from "../services/authService";
import {
  connectSocket,
  joinRoom,
  sendSocketMessage,
  receiveSocketMessage,
  removeSocketListeners,
} from "../services/socket";

const SELECTED_CHAT_KEY = "whatsapp_clone_selected_chat";

function ChatWindow({ selectedChat }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const messagesContainerRef = useRef(null);
  const menuRef = useRef(null);
  const currentUser = getStoredUser();

  // Handle menu closing when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Connect socket on mount
  useEffect(() => {
    if (currentUser?._id || currentUser?.id) {
      connectSocket();
      joinRoom(currentUser._id || currentUser.id);
    }
    return () => {
      removeSocketListeners();
    };
  }, [currentUser]);

  // Handle selected chat changes & local storage
  useEffect(() => {
    if (selectedChat?._id) {
      setActiveChat(selectedChat);
      localStorage.setItem(SELECTED_CHAT_KEY, JSON.stringify(selectedChat));
    } else {
      try {
        const savedChat = localStorage.getItem(SELECTED_CHAT_KEY);
        if (savedChat) {
          setActiveChat(JSON.parse(savedChat));
        } else {
          setActiveChat(null);
        }
      } catch {
        setActiveChat(null);
      }
    }
  }, [selectedChat]);

  // Fetch messages from backend
  const fetchMessages = useCallback(async () => {
    if (!activeChat?._id) return;

    try {
      const data = await getMessages(activeChat._id);
      if (data?.success) {
        const sortedMessages = (data.messages || []).sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        setMessages(sortedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error.response?.data || error.message);
      setMessages([]);
    }
  }, [activeChat]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Listen for live messages via socket
  useEffect(() => {
    if (!activeChat?._id) return;

    receiveSocketMessage((newMessage) => {
      const senderId = newMessage.senderId?._id || newMessage.senderId;
      const receiverId = newMessage.receiverId?._id || newMessage.receiverId;

      if (senderId === activeChat._id || receiverId === activeChat._id) {
        setMessages((prevMessages) => {
          const alreadyExists = prevMessages.some((msg) => msg._id === newMessage._id);
          if (alreadyExists) return prevMessages;
          return [...prevMessages, newMessage];
        });
      }
    });
  }, [activeChat]);

  // Send text messages between users
  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat?._id) return;

    try {
      const response = await sendMessage({
        receiverId: activeChat._id,
        text: message.trim(),
      });

      if (response?.success && response?.data) {
        setMessages((prevMessages) => [...prevMessages, response.data]);
        sendSocketMessage(response.data);
        setMessage("");
        
        // Force scroll to bottom when sending
        setTimeout(() => {
          const container = messagesContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }, 10);
      }
    } catch (error) {
      console.error("Failed to send message:", error.response?.data || error.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!activeChat?._id) return;
    try {
      await deleteChat(activeChat._id);
      setMessages([]);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  };

  const handleContactInfo = () => {
    setMenuOpen(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Smart Conditional Auto-Scroll
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;

    if (isNearBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // Force scroll to bottom immediately when opening a chat
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [activeChat?._id]);

  // Empty state handling
  if (!activeChat) {
    return (
      <section className="flex h-[calc(100vh-3rem)] flex-1 flex-col items-center justify-center bg-orange-100 px-6 text-center">
        <img
          src={Assets.logo}
          alt="WhatsApp Web Clone"
          className="h-20 w-20 object-contain grayscale"
        />
        <h2 className="mt-5 text-2xl font-bold text-gray-950">
          WhatsApp Web Clone
        </h2>
        <p className="mt-2 max-w-md text-sm font-medium leading-6 text-gray-600">
          Select a chat from the list to view messages and start a conversation.
        </p>
      </section>
    );
  }

  return (
    <section className="relative flex h-[calc(100vh-3rem)] flex-1 flex-col bg-orange-100">
      {/* Fixed Chat Header */}
      <header className="flex h-16 shrink-0 items-center justify-between bg-[#FFF8F2]/90 px-5 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img
            src={
              activeChat.profileImage && activeChat.profileImage.trim() !== ""
                ? activeChat.profileImage
                : Assets.profile
            }
            alt={activeChat.fullName || activeChat.username}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = Assets.profile;
            }}
            className="h-10 w-10 rounded-full bg-gray-200 object-cover"
          />

          <div>
            <h2 className="text-sm font-bold text-gray-950">
              {activeChat.fullName || activeChat.username}
            </h2>
            <p className="text-xs font-medium text-gray-600">
              {activeChat.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl p-2 text-gray-800 transition hover:bg-orange-100 hover:text-orange-600"
          >
            <MoreVertical size={22} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-2xl border border-orange-100 bg-white py-2 shadow-xl">
              <button 
                onClick={handleContactInfo}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-orange-50"
              >
                <Info size={17} />
                Contact Info
              </button>

              <button 
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={17} />
                Delete Chat
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Scrollable Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-5" ref={messagesContainerRef}>
        <div className="space-y-3">
          {messages.map((chat) => {
            const senderId = chat.senderId?._id || chat.senderId;
            const isMine = senderId === currentUser?._id || senderId === currentUser?.id;

            return (
              <div
                key={chat._id || chat.id}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMine
                      ? "rounded-br-sm bg-orange-400 text-white"
                      : "rounded-bl-sm bg-white text-gray-900"
                  }`}
                >
                  <p className="text-sm font-medium leading-6">{chat.text}</p>

                  <p
                    className={`mt-1 text-right text-[10px] ${
                      isMine ? "text-orange-50" : "text-gray-500"
                    }`}
                  >
                    {new Date(chat.createdAt || chat.timestamp || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Message Input */}
      <div className="flex shrink-0 items-center gap-3 px-5 py-4">
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSendMessage();
          }}
          placeholder="Type a message"
          className="h-11 flex-1 rounded-full border border-orange-200 bg-white/90 px-5 text-sm font-medium text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100"
        />

        <button
          type="button"
          onClick={handleSendMessage}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-400 text-white shadow-sm transition hover:bg-orange-500"
        >
          <Send size={19} />
        </button>
      </div>

      {/* Coming Soon Toast Notification */}
      {showToast && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg transition-opacity duration-300">
          Contact Info panel coming soon!
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold text-gray-900">Delete Chat</h3>
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
              Are you sure you want to delete your conversation with{" "}
              <span className="font-bold text-gray-900">
                {activeChat.fullName || activeChat.username}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-gray-600 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ChatWindow;