import mongoose from "mongoose";
import { userModel } from "./user.schema.js";
import ApplicationError from "../middlewares/errorHandler.js";

import { ObjectId } from "mongodb";

export default class UserRepository{

    async registerUser(userData){
        try{
            const newUser = new userModel(userData);
            await newUser.save();
        }
        catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

    async loginUser(email){
        try{
            const user = await userModel.findOne({email});
            return user;
        }
        catch(err){
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

    async getUserById(id){
        try{
            const user = await userModel.findById(id)
            return user;
        }
        catch(err){
            console.log(err)
            throw new ApplicationError(500, "Something went wrong in the database")
        }
    }

    async getAllUsers(){
        try{
            const users = await userModel.find({});
            return users;
        }
        catch(err){
            console.log(err)
            throw new ApplicationError(500, "Something went wrong in the database")
        }
    }

    async updateUser(id,name, email, gender){
        let filterExpression = {};
        if(name){
            filterExpression.name = name
        }
        if(email){
            filterExpression.email = email;
        }
       
        if(gender){
            filterExpression.gender = gender;
        }
        try{
            return await userModel.findOneAndUpdate({_id : new ObjectId(id)}, {$set : filterExpression}, {new : true});
        }
        catch(err){
            console.log(err)
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

   
}