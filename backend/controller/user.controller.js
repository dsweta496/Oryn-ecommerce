import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { verifyEmail } from "../EmailVerify/verifyEmail.js";
import { Session } from "../models/session.model.js";
import { sendOTPmail } from "../EmailVerify/sendOTPmail.js";

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400)
                .json({
                    success: false,
                    message: "All fields are required"
                });
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400)
                .json({
                    success: false,
                    message: "User already exists"
                });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: '10m' });

        verifyEmail(token, email);
        newUser.token = token;

        await newUser.save();
        return res.status(201)
            .json({ success: true, message: "Account created successfully!", user: newUser })
    } catch (error) {
        res.status(500)
            .json({ success: false, message: error.message })
    }
}

export const verify = async (req, res) => {
    try {
        const authheader = req.headers.authorization;

        if (!authheader || !authheader.startsWith("Bearer ")) {
            return res.status(400).json({
                success: false,
                message: "Authorization token is missing or unauthorized."
            });
        }

        const token = authheader.split(" ")[1];

        let decoded;

        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired."
                });
            }

            return res.status(400).json({
                success: false,
                message: "Token verification failed."
            });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        user.token = null;
        user.isVerified = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User verified successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const reVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400)
                .json({ success: false, message: "User not found." })
        }
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '10m' });
        verifyEmail(token, email);
        user.token = token;
        await user.save()
        return res.status(200)
            .json({ success: true, message: "Verification mail sent succesffully.", token: user.token })
    } catch (error) {
        return res.status(500)
            .json({ success: false, message: error.message })
    }

}

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400)
                .json({ success: false, message: "All feilds required." })
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400)
                .json({ success: false, message: "User not found." })
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(400)
                .json({ success: false, message: "Invalid Password." })
        }
        if (existingUser.isVerified == false) {
            return res.status(400)
                .json({ success: false, message: "Verify your account to login." })
        }

        // generate token

        const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '10d' });
        const refreshToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: '30d' });
        existingUser.isLoggedIn = true;
        await existingUser.save();

        //checking for existing session
        const existingSession = await Session.findOne({ userId: existingUser._id })
        if (existingSession) {
            await Session.deleteOne({ userId: existingUser._id })
        }

        await Session.create({ userId: existingUser._id })
        return res.status(200)
            .json({ success: true, message: `Welcom back ${existingUser.firstName}`, user: existingUser, accessToken, refreshToken })
    } catch (error) {
        return res.status(500)
            .json({ success: false, message: error.message })
    }
}

export const logOut = async (req, res) => {
    try {
        const userId = req.id
        await Session.deleteMany({ userId: userId })
        await User.findByIdAndUpdate(userId, { isLoggedIn: false })
        return res.status(200)
            .json({ success: true, message: "User logged out successfully." })

    } catch (error) {
        return res.status(500)
            .json({ success: false, message: error.message })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400)
                .json({ success: false, message: "User not found" })
        }
        const OTP = Math.floor(100000 + Math.random() * 900000).toString()
        const OTPexpiry = new Date(Date.now() + 10 * 60 * 1000)
        user.otp = OTP
        user.otpExpiry = OTPexpiry

        await user.save()

        await sendOTPmail(OTP, email);

        return res.status(200)
            .json({ success: true, message: `OTP sent to ${email} successfully.` })
    } catch (error) {
        return res.status(500)
            .json({ success: false, message: error.message })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.params.email;
        if (!otp) {
            return res.status(400)
                .json({ success: false, message: "OTP is required." })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400)
                .json({ success: false, message: "User not found." })
        }
        if (!user.otp || !user.otpExpiry) {
            return res.status(400)
                .json({ success: false, message: "OTP  is not generated or already verified." })
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400)
                .json({ success: false, message: "OTP  has expired please request a new one." })
        }
        if (otp !== user.otp) {
            return res.status(400)
                .json({ success: false, message: "Incorrect OTP." })
        }
        user.otp = null;
        user.otpExpiry = null;
        await user.save();
        return res.status(200)
            .json({ success: true, message: "OTP  verified successfully." })
    } catch (error) {
        return res.status(500)
            .json({ success: false, message: error.message })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400)
                .json({ success: false, message: "User not found." })
        }
        if (!newPassword || !confirmPassword) {
            return res.status(400)
                .json({ success: false, message: "All feilds required" })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400)
                .json({ success: false, message: "Confirmed password does not match." })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200)
            .json({ success: true, message: "Password changed successfully." })
    } catch (error) {
        return res.status(500)
            .json({ success: false, message: error.message })
    }
}

export const allUser = async (_, res) => {
    try {
        const users = await User.find();
        return res.status(200)
            .json({ success: true, users })
    } catch (error) {
        return res.status(500)
            .json({ success: false, message: error.message })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password -otp -otpExpiry -token");

        if (!user) {
            return res.status(400)
                .json({
                    success: false,
                    message: "User not found."
                });
        }

        return res.status(200)
            .json({
                success: true,
                user
            });

    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: error.message
            });
    }
};