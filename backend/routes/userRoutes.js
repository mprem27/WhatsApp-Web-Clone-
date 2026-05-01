import express from "express";
import {
  completeProfile,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  searchUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const userRouter = express.Router();

userRouter.post(
  "/complete-profile",
  protect,
  upload.single("profileImage"),
  completeProfile
);

userRouter.get("/all", protect, getAllUsers);

userRouter.get("/profile", protect, getUserProfile);

userRouter.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateUserProfile
);

userRouter.get("/search", protect, searchUsers);

export default userRouter;