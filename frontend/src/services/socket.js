import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
  }

  return socket;
};

export const joinRoom = (userId) => {
  if (!socket || !userId) return;

  socket.emit("joinRoom", userId);
};

export const sendSocketMessage = (messageData) => {
  if (!socket || !messageData?.receiverId) return;

  socket.emit("sendMessage", messageData);
};

export const receiveSocketMessage = (callback) => {
  if (!socket || typeof callback !== "function") return;

  socket.off("receiveMessage");
  socket.on("receiveMessage", (messageData) => {
    callback(messageData);
  });
};

export const listenOnlineUsers = (callback) => {
  if (!socket || typeof callback !== "function") return;

  socket.off("onlineUsers");
  socket.on("onlineUsers", (users) => {
    callback(users);
  });
};

export const listenTyping = (callback) => {
  if (!socket || typeof callback !== "function") return;

  socket.off("typing");
  socket.on("typing", (data) => {
    callback(data);
  });
};

export const listenStopTyping = (callback) => {
  if (!socket || typeof callback !== "function") return;

  socket.off("stopTyping");
  socket.on("stopTyping", (data) => {
    callback(data);
  });
};

export const sendTyping = ({ senderId, receiverId }) => {
  if (!socket || !senderId || !receiverId) return;

  socket.emit("typing", { senderId, receiverId });
};

export const sendStopTyping = ({
  senderId,
  receiverId,
}) => {
  if (!socket || !senderId || !receiverId) return;

  socket.emit("stopTyping", { senderId, receiverId });
};

export const removeSocketListeners = () => {
  if (!socket) return;

  socket.off("receiveMessage");
  socket.off("onlineUsers");
  socket.off("typing");
  socket.off("stopTyping");
};

export const disconnectSocket = () => {
  if (socket) {
    removeSocketListeners();
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;