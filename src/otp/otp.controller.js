import { sendingMail } from "../middlewares/sendMail.middleware.js";
import OtpRepository from "./otp.repository.js";
import bcrypt from 'bcrypt'
export default class OtpController{
    constructor(){
        this.otpRepository = new OtpRepository();
    }

    async sendOtp(req, res, next){
        const newOtp = {
            otp : Math.floor(10000 + Math.random() * 90000),
            status : 'valid'
        }
        try{
            const email = req.body.email;
            if(!email){
                return res.status(400).send("please provide the email")
            }
            await this.otpRepository.sendOtp(newOtp);
            sendingMail(newOtp.otp, email)
            res.status(200).send('otp sent to your mail successfully')
        }
        catch(err){
            next(err);
        }
    }

    async verifyOtp(req, res, next){
        try{
            const otp = req.body.otp;
            const result = await this.otpRepository.verifyOtp(otp);
            if(!result){
                return res.status(400).send("invalid otp")
            }
           return res.status(200).send("otp verified successfully")
        }
        catch(err){
            next(err);
        }
    }

    async resetPassword(req, res, next){
        const {email, password, otp} = req.body;
        if(!otp){
            return res.status(400).send("please provide otp. you can receive otp to the mail on /api/otp/send route")
        }
        try{
            const result = await this.otpRepository.verifyOtp(otp);
            if(!result){
                return res.status(400).send("Invalid otp")
            }
            const newPassword = await bcrypt.hash(password, 12);
            await this.otpRepository.resetPassword(email,newPassword);
            res.status(200).send("password updated successfully")
        }
        catch(err){
            next(err);
        }
    }
}