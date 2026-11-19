import mongoose from "mongoose";
import { createApp } from "./app";
import http from "node:http";
import { connectDB } from "./common/db/connection";

async function startServer() {
    try {
        // Connect to MongoDB first
        await connectDB();

        // Create Express App
        const app = createApp();

        // Create HTTP Server
        const server = http.createServer(app);

        // Start Server
        server.listen(3000, () => {
            console.log("server start in port 3000");
        });

        // Graceful Shutdown
        async function shutDown() {
            server.close(async () => {
                await mongoose.disconnect();
                process.exit(0);
            });
        }

        process.on("SIGINT", shutDown);
        process.on("SIGTERM", shutDown);

    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
}

startServer();