import { Router } from "express";
import * as authController from "../controllers/authController";
import * as usersController from "../controllers/usersController";
import { uploadProfilePhoto } from "../middlewares/upload";

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

router.put(
  "/:id/photo",
  authController.protect,
  uploadProfilePhoto.single("photo"),
  usersController.updateUserPhoto
);

router
  .route("/:id/photo")
  .get(authController.protect, usersController.getUserPhoto);

export default router;
