import express from "express"
import { register, verify, reVerify, logIn, logOut, forgotPassword, verifyOTP, changePassword, allUser, getUserById} from "../controller/user.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";

const router=express.Router();

router.post('/register', register)
router.post('/verify', verify)
router.post('/reVerify', reVerify)
router.post('/login', logIn)
router.post('/logout', isAuthenticated, logOut)
router.post('/forgotPassword', forgotPassword)
router.post('/verify-otp/:email', verifyOTP)
router.post('/changePassword/:email', changePassword)
router.get('/allUsers',isAuthenticated, isAdmin, allUser)
router.get('/getUser/:id',getUserById)
export default router;