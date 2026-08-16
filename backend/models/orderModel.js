import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                productName: {
                    type: String,
                    required: true,
                },

                productImage: {
                    type: String,
                    default: "",
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["razorpay", "cod"],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "processing",
        },

        razorpayOrderId: {
            type: String,
            default: "",
        },

        razorpayPaymentId: {
            type: String,
            default: "",
        },

        shippingAddress: {
            fullName: {
                type: String,
                default: "",
            },

            phone: {
                type: String,
                default: "",
            },

            address: {
                type: String,
                default: "",
            },

            city: {
                type: String,
                default: "",
            },

            state: {
                type: String,
                default: "",
            },

            pincode: {
                type: String,
                default: "",
            },
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);