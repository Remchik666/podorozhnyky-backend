import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createStory,
  getAllStories,
  updateStory,
  deleteStory,
} from "../controllers/storyController.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
  createStorySchema,
  updateStorySchema,
} from "../validation/storySchemas.js";
import { validateBody } from "../middlewares/validateBody.js";

const router = express.Router();

router.post(
  "/",
  auth,
  validateBody(createStorySchema),
  ctrlWrapper(createStory)
);
router.get("/", ctrlWrapper(getAllStories));
router.patch(
  "/:id",
  auth,
  validateBody(updateStorySchema),
  ctrlWrapper(updateStory)
);
router.delete("/:id", auth, ctrlWrapper(deleteStory));

export default router;
