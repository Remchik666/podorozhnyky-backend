import express from "express";
import { auth } from "../middleware/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  saveStory,
  getSavedStories,
  getCurrentUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/current", auth, ctrlWrapper(getCurrentUser));
router.post("/save/:id", auth, ctrlWrapper(saveStory));
router.get("/saved", auth, ctrlWrapper(getSavedStories));

export default router;
