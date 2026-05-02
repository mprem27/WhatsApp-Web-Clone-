import api from "../api/api";

export const sendMessage = async ({ receiverId, text }) => {
  if (!receiverId || !text?.trim()) {
    throw new Error("Receiver and message are required");
  }

  const response = await api.post("/messages/send", {
    receiverId,
    text: text.trim(),
  });

  return response.data;
};

export const getMessages = async (receiverId) => {
  if (!receiverId) {
    throw new Error("Receiver ID is required");
  }

  const response = await api.get(`/messages/${receiverId}`);

  return response.data;
};

export const markAsSeen = async (senderId) => {
  if (!senderId) {
    throw new Error("Sender ID is required");
  }

  const response = await api.put(`/messages/seen/${senderId}`);

  return response.data;
};

export const deleteChat = async (receiverId) => {
  if (!receiverId) {
    throw new Error("Receiver ID is required");
  }

  const response = await api.delete(`/messages/${receiverId}`);

  return response.data;
};