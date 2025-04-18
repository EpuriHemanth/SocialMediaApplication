
import express from 'express';
import { connectusingMongoose } from './src/config/mongooseConnect.js';
import ApplicationError from './src/middlewares/errorHandler.js';
import mongoose from 'mongoose';
import { userRouter } from './src/users/user.routes.js';
import { loggerMiddleware } from './src/middlewares/logger.middleware.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { postRouter } from './src/posts/post.routes.js';
import { commentRouter } from './src/comments/comments.routes.js';
import { likeRouter } from './src/likes/like.routes.js';
import { friendRouter } from './src/friends/friend.routes.js';
import { otpRouter } from './src/otp/otp.routes.js';
//create the server
const server = express();


server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(path.resolve(), 'public')));
server.use(loggerMiddleware); //loggerMiddleware
server.use(cookieParser());
server.use("/api/users", userRouter); //route for users
server.use("/api/posts", postRouter); //route for posts
server.use("/api/comments", commentRouter); //route for comments
server.use("/api/likes", likeRouter); //route for likes
server.use("/api/friends", friendRouter); //route for friends
server.use("/api/otp", otpRouter)
//errorhandler middle ware
server.use((err, req, res, next) => {
    console.log(err);

    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message)
    }
    if(err instanceof ApplicationError){
        return res.status(err.statusCode).send(err.message)
    }
    
    return res.status(500).send("Something went wrong")
});

//No API found
server.use((req, res, next) => {
    res.status(404).send("No API found")
})

//make the server listen on port 3000
server.listen(3000, () => {
    console.log("server is listening on port 3000");
    connectusingMongoose();
})