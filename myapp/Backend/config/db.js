import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/resume";
    await mongoose.connect(mongoUri);
    console.log("DB is connected");
  } catch (err) {
    console.log("DB Connection Error:", err.message);
  }
};
