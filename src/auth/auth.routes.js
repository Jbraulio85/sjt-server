import { Router } from "express";
import express from 'express'
import { registerValidator, loginValidator} from "../../middlewares/check-validators.js";
import { register, login } from "./auth.controller.js";
import { publicLimiter } from "../../middlewares/request-limit.js";
import {
  profilePictureMemory,
  uploadProfilePictureToCloudinary,
} from "../../middlewares/profile-picture-cloudinary.js";
import { uploadsDir, repoAssetsDir } from "../../configs/paths.js";

const router = Router();

router.post("/register", 
  publicLimiter,
  profilePictureMemory.single("profilePicture"),
  registerValidator,
  uploadProfilePictureToCloudinary,
  register
);

router.post("/login", publicLimiter, loginValidator, login);

router.use(
    "/getImage",
    express.static(uploadsDir("assets", "img"))
  );
router.use(
    "/getImage",
    express.static(repoAssetsDir("assets", "img"))
  );

export default router;
