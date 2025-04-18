import express from 'express';
import UserController from './user.controller.js';

const userController = new UserController();
export const userRouter = express.Router();

userRouter.post("/signup", (req, res, next) => userController.registerUser(req, res, next));
userRouter.post("/signin", (req, res, next) => userController.loginUser(req, res, next));
userRouter.post("/logout", (req, res, next) => userController.logOut(req, res, next));
userRouter.get("/get-details/:userId", (req, res, next) => userController.getUserById(req, res, next));
userRouter.get("/get-all-details", (req, res, next) => userController.getAllUsers(req, res, next));
userRouter.put("/update-details/:userId", (req, res, next) => userController.updateUser(req, res, next));