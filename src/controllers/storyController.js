import { Story } from "../models/Story.js";
import createHttpError from "http-errors";

export const createStory = async (req, res) => {
  const { title, description, image, location } = req.body;

  const newStory = await Story.create({
    title,
    description,
    image,
    location,
    author: req.user._id,
  });

  res.status(201).json(newStory);
};

export const getAllStories = async (req, res) => {
  const { author, location, search } = req.query;

  const query = {};

  if (author) query.author = author;
  if (location) query.location = { $regex: location, $options: "i" };
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const stories = await Story.find(query).populate("author", "name avatar");
  res.status(200).json(stories);
};

export const likeStory = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw createHttpError.NotFound("Story not found");

  if (story.likes.includes(req.user._id)) {
    throw createHttpError.BadRequest("You already liked this story");
  }

  story.likes.push(req.user._id);
  await story.save();

  res.status(200).json({
    message: "Story liked successfully",
    likes: story.likes.length,
  });
};

export const unlikeStory = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw createHttpError.NotFound("Story not found");

  const before = story.likes.length;
  story.likes = story.likes.filter(
    (id) => id.toString() !== req.user._id.toString()
  );

  if (story.likes.length === before) {
    throw createHttpError.BadRequest("You have not liked this story");
  }

  await story.save();

  res.status(200).json({
    message: "Story unliked successfully",
    likes: story.likes.length,
  });
};

export const updateStory = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw createHttpError.NotFound("Story not found");

  if (story.author.toString() !== req.user._id.toString()) {
    throw createHttpError.Forbidden("You are not the author of this story");
  }

  Object.assign(story, req.body);
  const updated = await story.save();

  res.status(200).json(updated);
};

export const deleteStory = async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw createHttpError.NotFound("Story not found");

  if (story.author.toString() !== req.user._id.toString()) {
    throw createHttpError.Forbidden("You are not the author of this story");
  }

  await story.deleteOne();
  res.status(200).json({ message: "Story deleted successfully" });
};
