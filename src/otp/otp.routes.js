import express  from 'express';
import OtpController from './otp.controller.js';

const otpController = new OtpController();
export const otpRouter = express.Router();
otpRouter.post('/send', (req, res, next) => otpController.sendOtp(req, res, next));
otpRouter.post('/verify', (req, res, next) => otpController.verifyOtp(req, res, next));
otpRouter.post('/reset-password', (req, res, next) => otpController.resetPassword(req, res, next));