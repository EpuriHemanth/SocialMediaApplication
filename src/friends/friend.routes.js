import express from 'express';
import FriendController from './friend.controller.js';
import { jwtMiddleware } from '../middlewares/jwt.middleware.js';
const friendController = new FriendController();

export const friendRouter = express.Router();

friendRouter.post("/sendFriendRequest/:id", jwtMiddleware, (req, res, next) => friendController.sendFriendRequest(req, res, next));

friendRouter.get("/get-pending-requests", jwtMiddleware, (req, res, next) => friendController.getPendingRequests(req, res, next));
friendRouter.get("/get-friends/:userId", jwtMiddleware, (req, res, next) => friendController.getFriendsOfUser(req, res, next));
friendRouter.post("/response-to-request/:friendId", jwtMiddleware, (req, res, next) => friendController.respondToRequest(req, res, next));
friendRouter.put("/toggle-friendship/:friendId", jwtMiddleware, (req, res, next) => friendController.toogleFriendShip(req, res, next))