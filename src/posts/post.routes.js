import express from 'express';
import PostController from './post.controller.js';
import { jwtMiddleware } from '../middlewares/jwt.middleware.js';
import { upload } from '../middlewares/fileupload.middleware.js';
export const postRouter = express.Router();
const postController = new PostController();

postRouter.post('/', jwtMiddleware, upload.single('imageUrl'), (req, res, next) => postController.createPost(req, res, next));
postRouter.get("/all", (req, res, next) => postController.getAllposts(req, res, next));
postRouter.get("/", jwtMiddleware, (req, res, next) => postController.getPostsOfUser(req, res, next));
postRouter.get("/:postId", (req, res, next) => postController.getPostById(req, res, next));
postRouter.put("/:postId", jwtMiddleware, upload.single('imageUrl'), (req, res, next) => postController.updatePost(req, res, next));
postRouter.delete("/:postId", jwtMiddleware,  (req, res, next) => postController.deletePost(req, res, next));