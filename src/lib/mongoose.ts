// import mongoose from "mongoose";

// const MONGO_URI = process.env.NEXT_DATABASE_URL; // Replace with your MongoDB connection string

// if (!MONGO_URI) {
//   throw new Error("Please define the NEXT_DATABASE_URL environment variable.");
// }

// /** Singleton for Mongoose connection */
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGO_URI as string).then((mongoose) => mongoose);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;


import mongoose from "mongoose";

// Your MongoDB URI
const MONGO_URI = process.env.NEXT_DATABASE_URL;

if (!MONGO_URI) {
  throw new Error("Please define the NEXT_DATABASE_URL environment variable.");
}

// TypeScript interface to define the cache structure for mongoose connection
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Ensure `globalThis.mongoose` is typed correctly
declare global {
  var mongoose: MongooseCache | undefined;
}

// Cache to prevent multiple connections
let cached: MongooseCache = globalThis.mongoose || { conn: null, promise: null };

// If `mongoose` is not yet cached, connect to MongoDB
async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI as string).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Make sure to store the `mongoose` cache in globalThis if it's not already cached
if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

export default dbConnect;


