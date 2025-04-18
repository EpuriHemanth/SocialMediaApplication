import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

export const connectusingMongoose = async () =>{
    const url = process.env.DB_URL;
    try{
        await mongoose.connect(url);
        console.log("connected using mongoose");
    }
    catch(err){
        console.log(err);
    }
}