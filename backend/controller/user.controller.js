import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Session } from "../models/session.model.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isVerified: true
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully!",
            user: newUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields required."
            });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid Password."
            });
        }

        const accessToken = jwt.sign(
            { id: existingUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "10d" }
        );

        const refreshToken = jwt.sign(
            { id: existingUser._id },
            process.env.SECRET_KEY,
            { expiresIn: "30d" }
        );

        existingUser.isLoggedIn = true;
        await existingUser.save();

        // Check for existing session
        const existingSession = await Session.findOne({
            userId: existingUser._id
        });

        if (existingSession) {
            await Session.deleteOne({
                userId: existingUser._id
            });
        }

        await Session.create({
            userId: existingUser._id
        });

        return res.status(200).json({
            success: true,
            message: `Welcome back ${existingUser.firstName}`,
            user: existingUser,
            accessToken,
            refreshToken
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const logOut = async (req, res) => {
    try {
        const userId = req.id;

        await Session.deleteMany({
            userId: userId
        });

        await User.findByIdAndUpdate(
            userId,
            { isLoggedIn: false }
        );

        return res.status(200).json({
            success: true,
            message: "User logged out successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        const userId = req.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required."
            });
        }

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Confirmed password does not match."
            });
        }

        if (newPassword === currentPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from your current password."
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const allUser = async (_, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id)
            .select("-password -otp -otpExpiry -token");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found."
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const updateUser = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const loggedInUser = req.user;

        const {
            firstName,
            lastName,
            address,
            city,
            zipCode,
            phoneNo,
            role
        } = req.body;

        // Only the user themselves or an admin can update the profile
        if (
            loggedInUser._id.toString() !== userIdToUpdate &&
            loggedInUser.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to update this profile."
            });
        }

        let user = await User.findById(userIdToUpdate);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Keep existing profile picture if no new picture is uploaded
        let profilePicUrl = user.profilePic;
        let profilePicPublicId = user.profilePicPublicId;

        // If a new profile picture is uploaded
        if (req.file) {

            // Delete old image from Cloudinary
            if (profilePicPublicId) {
                await cloudinary.uploader.destroy(profilePicPublicId);
            }

            // Upload new image
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "profiles"
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(req.file.buffer);
            });

            profilePicUrl = uploadResult.secure_url;
            profilePicPublicId = uploadResult.public_id;
        }

        // Update user fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.address = address || user.address;
        user.city = city || user.city;
        user.zipCode = zipCode || user.zipCode;
        user.phoneNo = phoneNo || user.phoneNo;

        // Only update role if an admin is making the request
        if (loggedInUser.role === "admin" && role) {
            user.role = role;
        }

        user.profilePic = profilePicUrl;
        user.profilePicPublicId = profilePicPublicId;

        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};