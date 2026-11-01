import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI!);
    console.log("BD Connected");
  } catch (error) {
    console.error("Connection Error", error);
  }
};
