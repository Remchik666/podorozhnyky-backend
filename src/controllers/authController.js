import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import createHttpError from "http-errors";

import User from "../models/User.js";
import { Session } from "../models/Session.js";

const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000; // 30 days

const generateAccessToken = () => crypto.randomBytes(30).toString("base64");
const generateRefreshToken = () => crypto.randomBytes(30).toString("base64");

const createSession = async (userId) => {
  await Session.deleteOne({ userId });

  return await Session.create({
    userId,
    accessToken: generateAccessToken(),
    refreshToken: generateRefreshToken(),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIFETIME),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIFETIME),
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError.Conflict("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const session = await createSession(newUser._id);

  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    },
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    throw createHttpError.Unauthorized("Email or password is incorrect");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw createHttpError.Unauthorized("Email or password is incorrect");

  const session = await createSession(user._id);

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  });
};

export const refreshSession = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    throw createHttpError.BadRequest("Refresh token is required");

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError.Unauthorized("Invalid refresh token");

  if (session.refreshTokenValidUntil < new Date()) {
    await session.deleteOne();
    throw createHttpError.Unauthorized("Refresh token expired");
  }

  const user = await User.findById(session.userId);
  if (!user) {
    await session.deleteOne();
    throw createHttpError.Unauthorized("User not found");
  }

  session.accessToken = generateAccessToken();
  session.accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
  await session.save();

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    accessToken: session.accessToken,
  });
};

export const logoutUser = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw createHttpError.BadRequest("Access token is missing");
  }

  const accessToken = authHeader.split(" ")[1];

  const session = await Session.findOne({ accessToken });
  if (!session) throw createHttpError.Unauthorized("Invalid access token");

  await session.deleteOne();

  res.status(200).json({ message: "Logged out successfully" });
};
