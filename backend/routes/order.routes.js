import express from "express";

import {
    createCODOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    razorpayPaymentFailed,
    getMyOrders,
} from "../controller/orderController.js";

import { isAuthenticated } from "../middleware/isAuthenticated.js";


const router = express.Router();


 
// COD
 

router.post(
    "/cod",
    isAuthenticated,
    createCODOrder
);


 
// RAZORPAY
 

// Create Razorpay test order
router.post(
    "/razorpay/create",
    isAuthenticated,
    createRazorpayOrder
);


// Verify successful Razorpay payment
router.post(
    "/razorpay/verify",
    isAuthenticated,
    verifyRazorpayPayment
);


// Handle failed Razorpay payment
router.post(
    "/razorpay/failed",
    isAuthenticated,
    razorpayPaymentFailed
);


 
// GET USER ORDERS
 

router.get(
    "/my-orders",
    isAuthenticated,
    getMyOrders
);


export default router;