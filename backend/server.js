import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import socketHandler from "./sockets/socketHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* Database + Cloudinary Connections */
connectDb();
connectCloudinary();

/* Middleware */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Base Route */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "WhatsApp Web Clone API is running",
  });
});

/* API Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

/* Error Handling */
app.use(notFound);
app.use(errorHandler);

/* HTTP Server */
const server = http.createServer(app);

/* Socket.IO */
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

socketHandler(io);

/* Start Server */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});