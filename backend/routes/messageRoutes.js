import express from "express";
import {
  sendMessage,
  getMessages,
  markMessagesAsSeen,
  deleteConversation,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const messageRouter = express.Router();

messageRouter.post("/send", protect, sendMessage);
messageRouter.get("/:receiverId", protect, getMessages);
messageRouter.put("/seen/:senderId", protect, markMessagesAsSeen);
messageRouter.delete("/:receiverId", protect, deleteConversation);

export default messageRouter;
