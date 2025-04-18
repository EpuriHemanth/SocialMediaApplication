import express from 'express';
import CommentController from './comments.controller.js';
import { jwtMiddleware } from '../middlewares/jwt.middleware.js';

export const commentRouter = express.Router();
const commentController = new CommentController();

commentRouter.post("/:postId", jwtMiddleware, (req, res, next) => commentController.addComment(req, res, next));
commentRouter.get("/:postId", (req, res, next) => commentController.getPostComments(req, res, next));
commentRouter.put("/:commentId", jwtMiddleware, (req, res, next) => commentController.updateComment(req, res, next));
commentRouter.delete("/:commentId", jwtMiddleware, (req, res, next) => commentController.deleteComment(req, res, next));