import express from "express";
import {
    register,
    logIn,
    logOut,
    changePassword,
    allUser,
    getUserById,
    updateUser
} from "../controller/user.controller.js";

import {
    isAdmin,
    isAuthenticated
} from "../middleware/isAuthenticated.js";

import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", logIn);

router.post("/logout", isAuthenticated, logOut);

router.post(
    "/changePassword",
    isAuthenticated,
    changePassword
);

router.get(
    "/allUsers",
    isAuthenticated,
    isAdmin,
    allUser
);

router.get(
    "/getUser/:id",
    getUserById
);

router.put(
    "/update/:id",
    isAuthenticated,
    singleUpload,
    updateUser
);

export default router;