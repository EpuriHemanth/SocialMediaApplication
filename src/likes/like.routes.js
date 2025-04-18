import express from 'express';
import LikeController from './like.controller.js';
import { jwtMiddleware } from '../middlewares/jwt.middleware.js';

const likeController = new LikeController();
export const likeRouter = express.Router();
likeRouter.post("/toggle/:id", jwtMiddleware, (req, res, next) => likeController.toogleLike(req, res, next));
likeRouter.get("/:id", (req, res, next) => likeController.getLikes(req, res, next));