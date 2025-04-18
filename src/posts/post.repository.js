import mongoose from "mongoose";
import ApplicationError from "../middlewares/errorHandler.js";
import { postModel } from "./post.schema.js";
import { ObjectId } from "mongodb";
export default class PostRepository{

    //creating the post
    async createPost(postData){
        try{
            const newPost = new postModel(postData);
            await newPost.save();
        }
        catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            throw new ApplicationError("Something went wrong in the database")
        }
    }

    //retriving allm posts
    async getAllPosts(){
        try{
            return await postModel.find({});
        }
        catch(err){
            throw new ApplicationError(500, "something went wrong in the database");
        }
    }
    async getPostById(id){
        try{
           return await postModel.findById(id).populate('userId')
        }
        catch(err){
            console.log(err);
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

    //retrive posts of the user
    async getPostsOfUser(id){
        try{
            const userPosts = await postModel.find({userId : new ObjectId(id)});
            return userPosts;
        }
        catch(err){
            console.log(err);
            throw new ApplicationError(500, "something went wrong in the database");
        }
    }

    //delete the post
    async deletePost(postId, userId){
        try{
            const post = await postModel.findById(postId);
            
            if(post.userId != userId){
                return false;
            }
            await postModel.deleteOne({_id : new ObjectId(postId)});
            return post;
        }
        catch(err){
            console.log(err);
            throw new ApplicationError(500, "something went wrong in the database");
        }
    }

    //update the post
    async updatePost(id, caption, imageUrl, userId){
        let filterExpression = {};
        if(caption)
            filterExpression.caption = caption;
        if(imageUrl)
            filterExpression.imageUrl = imageUrl;
       
        try{
            
            const updatedPost = await postModel.findOneAndUpdate(
                {
                    _id : new ObjectId(id),
                    userId : new ObjectId(userId)
                },
                {
                    $set : filterExpression
                },
                {
                    new : true
                }
            );
           
            return updatedPost;
        }
        catch(err){
            throw new ApplicationError(500, "something went wrong in the database");
        }
    }

    
}