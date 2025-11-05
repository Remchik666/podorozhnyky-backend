import express from "express";
import {
  register,
  login,
  refreshSession,
  logoutUser,
} from "../controllers/authController.js";
import { validateBody } from "../middlewares/validateBody.js";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "../validation/authSchemas.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(register));
router.post("/login", validateBody(loginSchema), ctrlWrapper(login));
router.post(
  "/refresh",
  validateBody(refreshSchema),
  ctrlWrapper(refreshSession)
);
router.post("/logout", auth, ctrlWrapper(logoutUser));

export default router;
