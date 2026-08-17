import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPmail = async (otp, email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailConfigurations = {
            from: `"ORYN.com" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "ORYN Password Reset OTP",

            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>ORYN Password Reset</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #f7f7f9;
                font-family: Arial, Helvetica, sans-serif;
            ">

                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center" style="padding: 40px 15px;">

                            <table
                                width="600"
                                cellpadding="0"
                                cellspacing="0"
                                border="0"
                                style="
                                    max-width: 600px;
                                    width: 100%;
                                    background-color: #ffffff;
                                    border-radius: 16px;
                                    overflow: hidden;
                                    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
                                "
                            >

                                <!-- Header -->
                                <tr>
                                    <td align="center" style="
                                        padding: 30px 20px;
                                        background: linear-gradient(
                                            135deg,
                                            #e6007e,
                                            #6a0dad
                                        );
                                    ">

                                        <div style="
                                            font-size: 32px;
                                            font-weight: 800;
                                            color: #ffffff;
                                            letter-spacing: 1px;
                                        ">
                                            ORYN.com
                                        </div>

                                    </td>
                                </tr>

                                <!-- Content -->
                                <tr>
                                    <td style="
                                        padding: 45px;
                                        text-align: center;
                                    ">

                                        <div style="
                                            font-size: 48px;
                                            margin-bottom: 15px;
                                        ">
                                            🔐
                                        </div>

                                        <h1 style="
                                            margin: 0 0 15px;
                                            color: #222222;
                                            font-size: 28px;
                                            font-weight: 700;
                                        ">
                                            Password Reset
                                        </h1>

                                        <p style="
                                            margin: 0 auto 25px;
                                            color: #666666;
                                            font-size: 16px;
                                            line-height: 1.6;
                                        ">
                                            Use the OTP below to reset your
                                            ORYN account password.
                                        </p>

                                        <div style="
                                            display: inline-block;
                                            padding: 18px 35px;
                                            margin: 10px 0 25px;
                                            background-color: #f7e6f0;
                                            border-radius: 12px;
                                            color: #e6007e;
                                            font-size: 32px;
                                            font-weight: 800;
                                            letter-spacing: 8px;
                                        ">
                                            ${otp}
                                        </div>

                                        <p style="
                                            margin: 0;
                                            color: #888888;
                                            font-size: 13px;
                                            line-height: 1.5;
                                        ">
                                            This OTP is valid for a limited time.
                                        </p>

                                        <p style="
                                            margin: 25px 0 0;
                                            color: #888888;
                                            font-size: 13px;
                                            line-height: 1.6;
                                        ">
                                            If you did not request a password reset,
                                            you can safely ignore this email.
                                        </p>

                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td align="center" style="
                                        padding: 20px;
                                        background-color: #fafafa;
                                    ">

                                        <p style="
                                            margin: 0;
                                            color: #aaaaaa;
                                            font-size: 12px;
                                        ">
                                            © 2026 ORYN. All rights reserved.
                                        </p>

                                    </td>
                                </tr>

                            </table>

                        </td>
                    </tr>
                </table>

            </body>
            </html>
            `,
        };

        const info = await transporter.sendMail(mailConfigurations);

        console.log("OTP email sent successfully");
        console.log(info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error("OTP email failed:", error);

        return {
            success: false,
            error: error.message,
        };
    }
};