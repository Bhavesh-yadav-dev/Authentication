
import nodemailer from 'nodemailer'
import 'dotenv/config'


export const sentToMail = async (email, otp) => {
    try {
        
        const transporter = nodemailer.createTransport({

            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        
       
const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "OTP Verification",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px;
                    margin: 0 auto; padding: 30px; background-color: #ffffff;
                    border: 1px solid #e5e7eb; border-radius: 10px;">

            <h2 style="color: #1f2937; text-align: center;">
                Email Verification
            </h2>

            <p style="color: #4b5563; font-size: 15px;">
                Hello,
            </p>

            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
                Please use the following One-Time Password (OTP)
                to complete your email verification.
            </p>

            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #f3f4f6;
                            padding: 18px 35px; border-radius: 8px;
                            font-size: 32px; font-weight: bold;
                            letter-spacing: 8px; color: #2563eb;">
                    ${otp}
                </div>
            </div>

            <p style="text-align: center; color: #dc2626; font-size: 14px;">
                This OTP is valid for 10 minutes.
            </p>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you did not request this verification code,
                please ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb;
                       margin: 25px 0;">

            <p style="text-align: center; color: #9ca3af; font-size: 12px;">
                This is an automated email. Please do not reply.
            </p>
        </div>
    `,
};


        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        throw error;
    }
}         