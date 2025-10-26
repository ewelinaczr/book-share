import { Router } from "express";
import * as authController from "../controllers/authController";
import * as usersController from "../controllers/usersController";

const router = Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);

router.route("/").get(usersController.getAllUsers);

router
  .route("/:id")
  .get(usersController.getUserById)
  .put(authController.protect, usersController.updateUserProfile)
  .delete(authController.protect, usersController.deleteUserAccount);

router
  .route("/location/:id")
  .patch(authController.protect, usersController.updateUserLocation);

export default router;
