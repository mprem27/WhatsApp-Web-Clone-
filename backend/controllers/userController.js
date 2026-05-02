import User from "../models/userModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

const getCurrentUserId = (req) => req.user?._id || req.user?.id;

const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const formatUserResponse = (user) => ({
  _id: user._id,
  username: user.username,
  fullName: user.fullName,
  email: user.email,
  profileImage: user.profileImage,
  about: user.about,
  isProfileComplete: user.isProfileComplete,
  isOnline: user.isOnline,
  lastSeen: user.lastSeen,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const completeProfile = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { username, fullName, about } = req.body;

    if (!username?.trim() || !fullName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username and full name are required",
      });
    }

    const normalizedUsername = username.toLowerCase().trim();

    const usernameExists = await User.findOne({
      username: normalizedUsername,
      _id: { $ne: userId },
    });

    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    let uploadedProfileImage = "";

    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      uploadedProfileImage = cloudinaryResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: normalizedUsername,
        fullName: fullName.trim(),
        ...(uploadedProfileImage && { profileImage: uploadedProfileImage }),
        about: about?.trim() || "Hey there! I am using WhatsApp Web Clone.",
        isProfileComplete: true,
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile completion failed",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);

    const users = await User.find({
      _id: { $ne: userId },
      isProfileComplete: true,
    })
      .select("-password")
      .sort({ isOnline: -1, fullName: 1 });

    return res.status(200).json({
      success: true,
      users: users.map(formatUserResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: formatUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const keyword = req.query.q?.trim() || "";

    if (!keyword) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const safeKeyword = escapeRegex(keyword);

    const users = await User.find({
      _id: { $ne: userId },
      isProfileComplete: true,
      $or: [
        { username: { $regex: safeKeyword, $options: "i" } },
        { fullName: { $regex: safeKeyword, $options: "i" } },
        { email: { $regex: safeKeyword, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(20);

    return res.status(200).json({
      success: true,
      users: users.map(formatUserResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User search failed",
      error: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const { fullName, about } = req.body;

    let uploadedProfileImage;

    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      uploadedProfileImage = cloudinaryResult.secure_url;
    }

    const updatedData = {
      ...(fullName !== undefined && { fullName: fullName.trim() }),
      ...(uploadedProfileImage && { profileImage: uploadedProfileImage }),
      ...(about !== undefined && { about: about.trim() }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message,
    });
  }
};