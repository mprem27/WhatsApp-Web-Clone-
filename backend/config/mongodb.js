import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in .env file");
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDb;
