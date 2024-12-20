import mongoose from "mongoose";

let isConnected: any = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI!, {});

    isConnected = db.connections[0].readyState;
    console.log("isConnected", isConnected);
  } catch (err) {
    console.log(err);
  }
};
