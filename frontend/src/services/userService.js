import api from "../api/api";
import { saveUser } from "./authService";

export const completeProfile = async (profileData) => {
  const response = await api.post("/users/complete-profile", profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data.user) {
    saveUser(response.data.user);
  }

  return response.data;
};

export const getUserProfile = async () => {
  const response = await api.get("/users/profile");

  if (response.data.user) {
    saveUser(response.data.user);
  }

  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users/all");
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await api.get(
    `/users/search?q=${encodeURIComponent(query)}`
  );

  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data.user) {
    saveUser(response.data.user);
  }

  return response.data;
};