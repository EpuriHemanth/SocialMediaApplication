import ApplicationError from "../middlewares/errorHandler.js";
import { otpModel } from "./otp.schema.js";
import { userModel } from "../users/user.schema.js";
import mongoose from "mongoose";
export default class OtpRepository{
    async sendOtp(otp){
        try{
            const newOtp = new otpModel(otp);
            const savedOtp = await newOtp.save();
            setTimeout(async () => {
                await otpModel.findByIdAndUpdate(savedOtp._id, { status: 'expired' });
             
            }, 5 * 60 * 1000)
        }
        catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            throw new ApplicationError(500, "something went wrong in the databse")
        }
    }

    async verifyOtp(otp){
        try{
            const result = await otpModel.findOne(
                {
                    otp,
                    status : 'valid'
                }
            );
            return result;
        }
        catch(err){
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }

    async resetPassword(email, password){
        try{
            await userModel.updateOne(
                { email }, // filter
                { $set: { password } }, // only password field
                // { runValidators: true } // this will validate only the fields being updated
              );
        }
        catch(err){
            if(err instanceof mongoose.Error.ValidationError){
                throw err;
            }
            throw new ApplicationError(500, "something went wrong in the database")
        }
    }
}