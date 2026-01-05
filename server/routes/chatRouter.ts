import { Router } from "express";
import * as authController from "../controllers/authController";
import * as chatController from "../controllers/chatController";

const router = Router();

router
  .route("/history/:userId")
  .get(authController.protect, chatController.getMessageHistory)
  .delete(authController.protect, chatController.deleteChatHistory);

router
  .route("/partners")
  .get(authController.protect, chatController.getChatPartners);

export default router;
