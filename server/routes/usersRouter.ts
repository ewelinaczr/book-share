import { Router } from "express";
import * as usersController from "../controllers/usersController";
import * as authController from "../controllers/authController";

const router = Router();
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/me", authController.isLoggedIn, authController.me);
router.route("/").get(usersController.getAllUsers);
router.route("/:id").get(usersController.getUserById);

export default router;
