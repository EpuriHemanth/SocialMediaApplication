import dotenv from 'dotenv';
dotenv.config();
import UserRepository from "./user.repository.js";
import UserModel from "./user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
export default class UserController{
    constructor(){
        this.userRepository = new UserRepository()
    }

    async registerUser(req, res, next){
        const {name, email, password, gender} = req.body;
        
        try{
            const newPassword = await bcrypt.hash(password, 12)
            const newUser = new UserModel(name, email, newPassword, gender);
            await this.userRepository.registerUser(newUser);
            res.status(201).send("registered the user successfully");
        }
        catch(err){
            next(err);
        }
    }

    async loginUser(req, res, next){
        const {email, password} = req.body;
        try{
            const user = await this.userRepository.loginUser(email);
            if(!user){
                return res.status(400).send("No user found")
            }
            const isValidUser = await bcrypt.compare(password, user.password);
            if(isValidUser){
                const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {algorithm : 'HS256', expiresIn : '1d'});
                res.cookie('jwtToken', token);
                
                res.status(200).send(user);
            }
            else{
                res.status(400).send("Invalid Credentials.")
            }
        }
        catch(err){
            next(err);
        }
    }
    async logOut(req, res, next){
        try{
            await res.clearCookie('jwtToken');
            res.status(200).send("signed out successfully")
        }
        catch(err){
            next(err);
        }
    }

    async getUserById(req, res, next){
        const userId = req.params.userId;
        try{
            const user = await this.userRepository.getUserById(userId);
            if(!user){
                return res.status(404).send("No user foung with this id")
            }
            res.status(200).send(user);
        }
        catch(err){
            next(err);
        }
    }

    async getAllUsers(req, res, next){
        try{
           
            const users = await this.userRepository.getAllUsers();
            return res.status(200).send(users);
        }
        catch(err){
            next(err);
        }
    }

    async updateUser(req, res, next){
        const {name, email, password, gender} = req.body;
        const id = req.params.userId
        try{
           
            
            const updatedUser = await this.userRepository.updateUser(id, name, email, gender);
            res.status(200).send(updatedUser)
        }
        catch(err){
            next(err);
        }
    }
  
}