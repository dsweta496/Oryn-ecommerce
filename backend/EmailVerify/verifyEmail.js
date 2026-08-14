import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = (token, email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const verificationLink = `http://localhost:5173/verify/${token}`;

    const mailConfigurations = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Verify your ORYN account",

        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your ORYN account</title>
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

                        <!-- Main Card -->
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
                                    ">ORYN.com
                                    </div>

                                </td>
                            </tr>

                            <!-- Content -->
                            <tr>
                                <td style="
                                    padding: 45px 45px 35px;
                                    text-align: center;
                                ">

                                    <div style="
                                        font-size: 48px;
                                        margin-bottom: 15px;
                                    ">
                                        ✉️
                                    </div>

                                    <h1 style="
                                        margin: 0 0 15px;
                                        color: #222222;
                                        font-size: 28px;
                                        font-weight: 700;
                                    ">
                                        Verify your email
                                    </h1>

                                    <p style="
                                        margin: 0 auto 25px;
                                        color: #666666;
                                        font-size: 16px;
                                        line-height: 1.6;
                                        max-width: 450px;
                                    ">
                                        Welcome to <strong style="color:#e6007e;">
                                        ORYN</strong>!
                                        Please verify your email address to
                                        activate your account and start shopping.
                                    </p>

                                    <!-- Button -->
                                    <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        align="center"
                                    >
                                        <tr>
                                            <td align="center" style="
                                                border-radius: 8px;
                                                background-color: #e6007e;
                                            ">
                                                <a
                                                    href="${verificationLink}"
                                                    style="
                                                        display: inline-block;
                                                        padding: 14px 35px;
                                                        color: #ffffff;
                                                        text-decoration: none;
                                                        font-size: 16px;
                                                        font-weight: 700;
                                                        border-radius: 8px;
                                                    "
                                                >
                                                    Verify My Email
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <p style="
                                        margin: 28px 0 0;
                                        color: #888888;
                                        font-size: 13px;
                                        line-height: 1.5;
                                    ">
                                        This verification link will expire in
                                        <strong>10 minutes</strong>.
                                    </p>

                                </td>
                            </tr>

                            <!-- Divider -->
                            <tr>
                                <td style="padding: 0 45px;">
                                    <div style="
                                        height: 1px;
                                        background-color: #eeeeee;
                                    "></div>
                                </td>
                            </tr>

                            <!-- Security Message -->
                            <tr>
                                <td style="
                                    padding: 25px 45px 35px;
                                    text-align: center;
                                ">

                                    <p style="
                                        margin: 0;
                                        color: #888888;
                                        font-size: 13px;
                                        line-height: 1.6;
                                    ">
                                        If you didn't create an ORYN account,
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
        `
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);

        console.log("Verification email sent successfully");
        console.log(info);
    });
};