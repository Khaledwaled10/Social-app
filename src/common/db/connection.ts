import mongoose from "mongoose";
import { env } from "../config/env";

export async function connectDB() {
    try {
        await mongoose.connect(env.db.url);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed:", error);
        throw error;
    }
}