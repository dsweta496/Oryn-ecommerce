import express from "express";

import {
    createCODOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    razorpayPaymentFailed,
    getMyOrders,
} from "../controller/orderController.js";

import {
    getAdminIncomeStats,
    getProductSalesAnalytics,
} from "../controller/analyticsController.js";

import {
    isAuthenticated,
    isAdmin,
} from "../middleware/isAuthenticated.js";


const router = express.Router();


router.post(
    "/cod",
    isAuthenticated,
    createCODOrder
);


router.post(
    "/razorpay/create",
    isAuthenticated,
    createRazorpayOrder
);


router.post(
    "/razorpay/verify",
    isAuthenticated,
    verifyRazorpayPayment
);


router.post(
    "/razorpay/failed",
    isAuthenticated,
    razorpayPaymentFailed
);


router.get(
    "/my-orders",
    isAuthenticated,
    getMyOrders
);


router.get(
    "/admin/stats",
    isAuthenticated,
    isAdmin,
    getAdminIncomeStats
);


router.get(
    "/admin/product-analytics",
    isAuthenticated,
    isAdmin,
    getProductSalesAnalytics
);


export default router;