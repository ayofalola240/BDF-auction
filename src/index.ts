import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("starting up app...");
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}`);
  });
};

start();
