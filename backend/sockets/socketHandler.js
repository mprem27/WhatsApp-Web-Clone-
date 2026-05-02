const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinRoom", (userId) => {
      if (!userId) return;

      if (onlineUsers.get(userId) === socket.id) {
        return;
      }

      socket.join(userId);
      onlineUsers.set(userId, socket.id);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
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
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

export default socketHandler;