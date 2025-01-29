import mongoose from "mongoose";

const MONGO_URI = process.env.NEXT_DATABASE_URL;

if (!MONGO_URI) {
  throw new Error("Please define the NEXT_DATABASE_URL environment variable.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = globalThis.mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false, // Disable auto-creation of indexes in production
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if no server is found
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    cached.promise = mongoose.connect(MONGO_URI as string, options).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;

  const connection = mongoose.connection;

  connection.on("connected", () => {
    console.log("Mongoose connected to DB.");
  });

  connection.on("error", (err) => {
    console.error("Mongoose connection error:", err);
  });

  connection.on("disconnected", () => {
    console.warn("Mongoose disconnected. Attempting to reconnect...");
    reconnect();
  });

  return cached.conn;
}

async function reconnect() {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("Mongoose successfully reconnected.");
  } catch (err) {
    console.error("Mongoose reconnection failed:", err);
    setTimeout(reconnect, 5000); // Retry after 5 seconds
  }
}

if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

export default dbConnect;
