import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    otp : {
        type : Number,
        required : [true, 'otp is required']
    },
    status : {
        type : String,
        enum : ['valid', 'expired'],
        default : 'valid'
    }
});
export const otpModel = mongoose.model('OTP', otpSchema)