import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPmail = async (otp, email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const otpDigits = String(otp).split("");

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "ORYN | Password Reset OTP",

        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset OTP</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f5f5f7;
            font-family: Arial, Helvetica, sans-serif;
            color: #292b32;
        ">

            <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="background-color: #f5f5f7; padding: 40px 15px;"
            >
                <tr>
                    <td align="center">

                        <!-- Main Email Container -->
                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                max-width: 680px;
                                background: linear-gradient(
                                    145deg,
                                    #fff9fc 0%,
                                    #ffffff 55%,
                                    #fff7fb 100%
                                );
                                border: 1px solid #f4dce8;
                                border-radius: 18px;
                                overflow: hidden;
                            "
                        >

                            <!-- ORYN Header -->
                            <tr>
                                <td
                                    align="center"
                                    style="padding: 42px 30px 25px;"
                                >

                                    <div style="
                                        display: inline-block;
                                        font-size: 32px;
                                        font-weight: 800;
                                        letter-spacing: 6px;
                                        color: #d72f78;
                                    ">
                                        ♙ORYN
                                    </div>

                                </td>
                            </tr>


                            <!-- Content -->
                            <tr>
                                <td
                                    align="center"
                                    style="padding: 10px 45px 45px;"
                                >

                                    <!-- Lock Icon -->
                                    <div style="
                                        width: 68px;
                                        height: 68px;
                                        line-height: 68px;
                                        border-radius: 50%;
                                        background-color: #fff0f6;
                                        color: #d72f78;
                                        font-size: 32px;
                                        margin: 0 auto 25px;
                                    ">
                                        🔒
                                    </div>


                                    <!-- Heading -->
                                    <h1 style="
                                        margin: 0 0 15px;
                                        font-size: 28px;
                                        line-height: 1.3;
                                        font-weight: 700;
                                        color: #292b32;
                                    ">
                                        Password Reset OTP
                                    </h1>


                                    <!-- Description -->
                                    <p style="
                                        margin: 0;
                                        max-width: 480px;
                                        font-size: 16px;
                                        line-height: 1.7;
                                        color: #666a73;
                                    ">
                                        We received a request to reset your
                                        password. Use the OTP below to verify
                                        your identity.
                                    </p>


                                    <!-- OTP -->
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="margin: 32px auto 28px;"
                                    >
                                        <tr>

                                            ${otpDigits.map((digit) => `
                                                <td style="padding: 0 5px;">
                                                    <div style="
                                                        width: 54px;
                                                        height: 68px;
                                                        line-height: 68px;
                                                        text-align: center;
                                                        border-radius: 12px;
                                                        background-color: #fff1f7;
                                                        border: 1px solid #f7d7e6;
                                                        color: #d72f78;
                                                        font-size: 30px;
                                                        font-weight: 700;
                                                    ">
                                                        ${digit}
                                                    </div>
                                                </td>
                                            `).join("")}

                                        </tr>
                                    </table>


                                    <!-- Expiry -->
                                    <p style="
                                        margin: 0 0 25px;
                                        font-size: 15px;
                                        color: #666a73;
                                    ">
                                        This OTP will expire in
                                        <strong style="color: #d72f78;">
                                            10 minutes.
                                        </strong>
                                    </p>


                                    <!-- Security Notice -->
                                    <div style="
                                        max-width: 470px;
                                        padding: 16px 20px;
                                        border-radius: 10px;
                                        background-color: #fff7fa;
                                        border: 1px solid #f5dce7;
                                        font-size: 13px;
                                        line-height: 1.6;
                                        color: #777b84;
                                    ">
                                        If you didn't request a password reset,
                                        you can safely ignore this email.
                                    </div>

                                </td>
                            </tr>


                            <!-- Footer -->
                            <tr>
                                <td style="padding: 0 45px 35px;">

                                    <div style="
                                        height: 1px;
                                        background-color: #f2d9e5;
                                        margin-bottom: 25px;
                                    "></div>

                                    <p style="
                                        margin: 0;
                                        text-align: center;
                                        font-size: 13px;
                                        line-height: 1.6;
                                        color: #999da5;
                                    ">
                                        © 2026 ORYN. All rights reserved.
                                    </p>

                                    <p style="
                                        margin: 6px 0 0;
                                        text-align: center;
                                        font-size: 12px;
                                        color: #b0b3ba;
                                    ">
                                        This is an automated security email.
                                        Please do not reply.
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

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);

        console.log("Email Sent Successfully");
        console.log(info);
    });
};