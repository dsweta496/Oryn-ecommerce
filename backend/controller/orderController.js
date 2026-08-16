import crypto from "crypto";
import Razorpay from "razorpay";

import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";


// RAZORPAY INSTANCE

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// CREATE COD ORDER

export const createCODOrder = async (req, res) => {
    try {
        const userId = req.id;

        const { shippingAddress } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ userId })
            .populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty.",
            });
        }

        // Create order items as a snapshot
        const orderItems = cart.items.map((item) => ({
            productId: item.productId._id,
            productName: item.productId.productName,
            productImage:
                item.productId.productImg?.[0]?.url || "",
            quantity: item.quantity,
            price: item.price,
        }));

        // Create COD order
        const order = await Order.create({
            userId,

            items: orderItems,

            totalAmount: cart.totalPrice,

            paymentMethod: "cod",

            paymentStatus: "pending",

            orderStatus: "processing",

            shippingAddress: shippingAddress || {},
        });

        // Clear cart ONLY after order is successfully created
        await Cart.findOneAndDelete({ userId });

        return res.status(201).json({
            success: true,
            message: "COD order placed successfully.",
            order,
        });

    } catch (error) {
        console.error("CREATE COD ORDER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// CREATE RAZORPAY TEST ORDER

export const createRazorpayOrder = async (req, res) => {
    try {
        const userId = req.id;

        const { shippingAddress } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ userId })
            .populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Your cart is empty.",
            });
        }

        // Create order items snapshot
        const orderItems = cart.items.map((item) => ({
            productId: item.productId._id,
            productName: item.productId.productName,
            productImage:
                item.productId.productImg?.[0]?.url || "",
            quantity: item.quantity,
            price: item.price,
        }));

        // Razorpay works in paise
        const amountInPaise = Math.round(cart.totalPrice * 100);

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",

            receipt: `oryn_${Date.now()}`,

            notes: {
                userId: userId.toString(),
            },
        });

        // Create our own database order
        // Payment is still pending at this point.
        const order = await Order.create({
            userId,

            items: orderItems,

            totalAmount: cart.totalPrice,

            paymentMethod: "razorpay",

            paymentStatus: "pending",

            orderStatus: "processing",

            razorpayOrderId: razorpayOrder.id,

            shippingAddress: shippingAddress || {},
        });

        return res.status(201).json({
            success: true,

            message: "Razorpay order created.",

            order,

            razorpayOrder: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },

            key: process.env.RAZORPAY_KEY_ID,
        });

    } catch (error) {
        console.error(
            "CREATE RAZORPAY ORDER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error?.error?.description ||
                error.message ||
                "Failed to create Razorpay order.",
        });
    }
};


// VERIFY RAZORPAY PAYMENT

export const verifyRazorpayPayment = async (req, res) => {
    try {
        const userId = req.id;

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing Razorpay payment details.",
            });
        }

        // Generate expected signature
        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");

        // Compare signatures
        if (generatedSignature !== razorpay_signature) {

            // Mark order as failed
            await Order.findOneAndUpdate(
                {
                    userId,
                    razorpayOrderId: razorpay_order_id,
                },
                {
                    paymentStatus: "failed",
                    orderStatus: "cancelled",
                }
            );

            return res.status(400).json({
                success: false,
                message: "Payment verification failed.",
            });
        }

        // Signature is valid
        const order = await Order.findOneAndUpdate(
            {
                userId,
                razorpayOrderId: razorpay_order_id,
            },
            {
                paymentStatus: "paid",
                orderStatus: "processing",
                razorpayPaymentId: razorpay_payment_id,
            },
            {
                new: true,
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        // Clear cart ONLY after successful payment
        await Cart.findOneAndDelete({ userId });

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully.",
            order,
        });

    } catch (error) {
        console.error(
            "RAZORPAY PAYMENT VERIFICATION ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Payment verification failed.",
        });
    }
};


// RAZORPAY PAYMENT FAILED

export const razorpayPaymentFailed = async (req, res) => {
    try {
        const userId = req.id;

        const {
            razorpay_order_id,
        } = req.body;

        if (!razorpay_order_id) {
            return res.status(400).json({
                success: false,
                message: "Razorpay order ID is required.",
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                userId,
                razorpayOrderId: razorpay_order_id,
            },
            {
                paymentStatus: "failed",
                orderStatus: "cancelled",
            },
            {
                new: true,
            }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }


        return res.status(200).json({
            success: true,
            message: "Payment marked as failed.",
            order,
        });

    } catch (error) {
        console.error(
            "RAZORPAY PAYMENT FAILED ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update payment status.",
        });
    }
};


// GET MY ORDERS

export const getMyOrders = async (req, res) => {
    try {
        const userId = req.id;

        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            orders,
        });

    } catch (error) {
        console.error(
            "GET MY ORDERS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};