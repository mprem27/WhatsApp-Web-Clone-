const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinRoom", (userId) => {
      if (!userId) return;

      socket.join(userId);
      onlineUsers.set(userId, socket.id);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log(`User ${userId} joined room`);
    });

    socket.on("sendMessage", (messageData) => {
      const { receiverId } = messageData;

      if (!receiverId) return;

      io.to(receiverId).emit("receiveMessage", messageData);
    });

    socket.on("typing", ({ senderId, receiverId }) => {
      if (!receiverId) return;

      io.to(receiverId).emit("typing", { senderId });
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
      if (!receiverId) return;

      io.to(receiverId).emit("stopTyping", { senderId });
    });

    socket.on("disconnect", () => {
      let disconnectedUserId = null;

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("Socket disconnected:", socket.id);
    });
  });
};

export default socketHandler;
