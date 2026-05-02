import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },

    fullName: {
      type: String,
      trim: true,
      default: "",
      maxlength: 50,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [ /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,"Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profileImage: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "Hey there! I am using WhatsApp Web Clone.",
      trim: true,
      maxlength: 250,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({
  fullName: "text",
  username: "text",
});

const User = mongoose.model("User", userSchema);

export default User;