import express from "express";
import pino from "pino-http";
import cors from "cors";
import { getEnvVar } from "./utils/getEnvVar.js";
import routes from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import path from "node:path";

const PORT = Number(getEnvVar("PORT", "3000"));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );
  app.use(cookieParser());

  app.use("/photo", express.static(path.resolve("src", "uploads", "photo")));

  app.use(routes);

  //not Found Handler
  app.use(notFoundHandler);

  //Error Handler
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
