import mongoose from "mongoose";

const MONGO_URI = process.env.NEXT_DATABASE_URL; // Replace with your MongoDB connection string

if (!MONGO_URI) {
  throw new Error("Please define the NEXT_DATABASE_URL environment variable.");
}

/** Singleton for Mongoose connection */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI as string).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
