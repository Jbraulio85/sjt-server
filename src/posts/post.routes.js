import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById
} from "./post.controller.js";
import {
  createPostValidator,
  getPostValidator
} from "../../middlewares/post-validators.js";

const router = Router();

router.post("/", createPostValidator, createPost);

router.get("/", getAllPosts);

router.get("/:id", getPostValidator, getPostById);

export default router;