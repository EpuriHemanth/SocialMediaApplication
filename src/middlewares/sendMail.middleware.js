import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'epurihemanth9@gmail.com',
        pass : 'fvkd duxl cblg ubxs'
    }
});

export const sendingMail = async (otp, mail) => {
    const mailOptions = {
        from : 'epurihemanth9@gmail.com',
        to : mail,
        subject : "resetting the password",
        text : `${otp}.\n This otp is valid for 5 minutes`
    };

    try{
        await transporter.sendMail(mailOptions);
        return "otp is sent to your mail successfully"
    }
    catch(err){
        console.log(err);
    }
}