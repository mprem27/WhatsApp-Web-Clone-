import api from "../api/api";


export const sendMessage = async ({ receiverId, text }) => {
  const response = await api.post("/messages/send", {
    receiverId,
    text,
  });

  return response.data;
};

export const getMessages = async (receiverId) => {
  const response = await api.get(`/messages/${receiverId}`);
  return response.data;
};

export const markAsSeen = async (senderId) => {
  const response = await api.put(`/messages/seen/${senderId}`);
  return response.data;
};

export const deleteChat = async (receiverId) => {
  const response = await api.delete(`/messages/${receiverId}`);
  return response.data;
};
