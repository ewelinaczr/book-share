import { Router } from "express";
import * as chatController from "../controllers/chatController";
import * as authController from "../controllers/authController";

const router = Router();

router
  .route("/history/:userId")
  .get(authController.protect, chatController.getMessageHistory);

router
  .route("/partners")
  .get(authController.protect, chatController.getChatPartners);

export default router;
