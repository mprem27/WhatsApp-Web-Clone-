import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

export const accessUser = async (req, res) => {
  try {
    const { emailOrUsername, email, username, password } = req.body;

    const loginIdentifier = emailOrUsername || email || username;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required",
      });
    }

    const identifier = loginIdentifier.toLowerCase().trim();

    let user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      user.isOnline = true;
      user.lastSeen = null;
      await user.save();

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        isNewUser: false,
        profileSetupRequired: !user.username || !user.fullName,
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          email: user.email,
          profileImage: user.profileImage,
          about: user.about,
          isOnline: user.isOnline,
          lastSeen: user.lastSeen,
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const isEmail = identifier.includes("@");

    user = await User.create({
      email: isEmail ? identifier : undefined,
      username: isEmail ? undefined : identifier,
      password: hashedPassword,
      isOnline: true,
      lastSeen: null,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration started",
      token,
      isNewUser: true,
      profileSetupRequired: true,
      redirectTo: "profile-setup",
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        about: user.about,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Auth failed",
      error: error.message,
    });
  }
};
