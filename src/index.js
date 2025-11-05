import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Test route
app.get("/ping", (req, res) => {
  res.send("Server is running");
});

//Connect to MongoBD
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoBD connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error", err);
  });

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/stories", storyRoutes);
