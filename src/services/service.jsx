import axios from "axios";
import authHeader from "../utils/authHeader"


const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Login API
export const loginService = async (credentials) => {
  const response = await api.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data; // { token }
};

// 📝 Register API
export const registerService = async (registerCredentials) => {
  const response = await api.post("/auth/signup", {
    username: registerCredentials.username,
    email: registerCredentials.email,
    password: registerCredentials.password,
  });

  return response.data; // user object
};

// Google login (TOKEN based)
export const googleLoginService = async (googleToken) => {
  const res = await api.post("/auth/google", {
    token: googleToken,
  });
  return res.data;
};




export default api;
