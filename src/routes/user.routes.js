import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { userController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userController
);

export default userRouter;
