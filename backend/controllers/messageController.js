import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

const getCurrentUserId = (req) => req.user?._id || req.user?.id;

export const sendMessage = async (req, res) => {
  try {
    const senderId = getCurrentUserId(req);
    const { receiverId, text } = req.body;

    if (!receiverId || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver and message text are required",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      text: text.trim(),
      delivered: receiver.isOnline,
      seen: false,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

export const markMessagesAsSeen = async (req, res) => {
  try {
    const receiverId = getCurrentUserId(req);
    const { senderId } = req.params;

    await Message.updateMany(
      {
        senderId,
        receiverId,
        seen: false,
      },
      {
        seen: true,
        delivered: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as seen",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update seen status",
      error: error.message,
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { receiverId } = req.params;

    await Message.deleteMany({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
      error: error.message,
    });
  }
};
