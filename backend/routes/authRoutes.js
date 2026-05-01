import express from "express";
import { accessUser } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/access", accessUser);

export default authRouter;
