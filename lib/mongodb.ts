import mongoose from "mongoose";

// Define the global mongoose type
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<any> | null;
  };
}

// Initialize the global mongoose object if it doesn't exist
if (!global.mongoose) {
  global.mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB
 * We cache the connection to avoid multiple connections in development
 */
export async function connectToDatabase() {
  // If we already have a connection, return it
  if (global.mongoose.conn) {
    console.log("📊 Using existing MongoDB connection");
    return global.mongoose.conn;
  }

  // If we don't have a connection, but we have a promise, return the promise
  if (!global.mongoose.promise) {
    // Try to get the MongoDB URI from environment variables
    // Fallback to MongoDB Atlas free tier connection if not set
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      "mongodb+srv://hackthisidea:hackthisidea@cluster0.mongodb.net/hackthisidea?retryWrites=true&w=majority";

    if (!MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable");
    }

    console.log("🔄 Connecting to MongoDB...");

    try {
      // Create the connection promise with additional options for better stability
      global.mongoose.promise = mongoose.connect(MONGODB_URI, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4, // Use IPv4, skip trying IPv6
      });

      // Add listeners for connection events
      mongoose.connection.on("connected", () => {
        console.log("✅ Connected to MongoDB successfully!");
      });

      mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err);
      });
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  try {
    // Wait for the connection to be established
    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    console.error("❌ Error establishing MongoDB connection:", error);
    throw error;
  }
}

// Export the mongoose instance for other files to use
export { mongoose };

// Export a shorter alias for the connection function
export const connectDB = connectToDatabase;
