import createHttpError from "http-errors";
import { Session } from "../models/Session.js";
import { User } from "../models/User.js";

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(createHttpError.Unauthorized("Access token is missing"));
  }

  const accessToken = authHeader.split(" ")[1];

  const session = await Session.findOne({ accessToken });
  if (!session) {
    return next(createHttpError.Unauthorized("Invalid access token"));
  }

  if (session.accessTokenValidUntil < new Date()) {
    await session.deleteOne();
    return next(createHttpError.Unauthorized("Access token expired"));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    await session.deleteOne();
    return next(createHttpError.Unauthorized("User not found"));
  }

  req.user = user;
  next();
};
