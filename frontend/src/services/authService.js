import api from "../api/api";

const TOKEN_KEY = "whatsapp_clone_token";
const USER_KEY = "whatsapp_clone_user";

export const accessUser = async ({
  emailOrUsername,
  email,
  password,
}) => {
  const response = await api.post("/auth/access", {
    emailOrUsername,
    email,
    password,
  });

  if (response.data.token) {
    localStorage.setItem(TOKEN_KEY, response.data.token);
  }

  if (response.data.user) {
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(response.data.user)
    );

    window.dispatchEvent(new Event("profileUpdated"));
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  window.dispatchEvent(new Event("profileUpdated"));
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  window.dispatchEvent(new Event("profileUpdated"));
};