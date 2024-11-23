import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

app.use(userRoutes);
app.use(postRoutes);
const start = async () => {
  const connectdb = await mongoose.connect(
    "mongodb+srv://rumjotsingh12345:4HzmDWqQRPEesSZe@socialmedia.m2egu.mongodb.net/"
  );
  console.log("connected to database");
};
app.listen(9090, () => {
  console.log("server is listening ");
});
start();
