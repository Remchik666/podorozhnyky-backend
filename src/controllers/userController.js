import createHttpError from "http-errors";
import { User } from "../models/User.js";
import { Story } from "../models/Story.js";

export const saveStory = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw createHttpError.NotFound("Story not found");

  const user = await User.findById(req.user._id);
  if (user.savedStories.includes(story._id)) {
    throw createHttpError.BadRequest("Story is already saved");
  }

  user.savedStories.push(story._id);
  await user.save();

  res.status(200).json({ message: "Story saved successfully" });
};

export const getSavedStories = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "savedStories",
    populate: {
      path: "author",
      select: "name avatar",
    },
  });

  res.status(200).json(user.savedStories);
};

export const getCurrentUser = async (req, res) => {
  const { _id, name, email, avatar } = req.user;
  res.status(200).json({ id: _id, name, email, avatar });
};
