import { Order } from "../models/orderModel.js";

export const getAdminIncomeStats = async (req, res) => {
    try {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);

        const successfulOrderFilter = {
            orderStatus: { $ne: "cancelled" },
            paymentStatus: { $ne: "failed" },
        };

        const lifetimeResult = await Order.aggregate([
            {
                $match: successfulOrderFilter,
            },
            {
                $group: {
                    _id: null,
                    lifetimeIncome: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]);

        const yearlyResult = await Order.aggregate([
            {
                $match: {
                    ...successfulOrderFilter,
                    createdAt: {
                        $gte: startOfYear,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    yearlyIncome: {
                        $sum: "$totalAmount",
                    },
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            lifetimeIncome:
                lifetimeResult.length > 0
                    ? lifetimeResult[0].lifetimeIncome
                    : 0,

            yearlyIncome:
                yearlyResult.length > 0
                    ? yearlyResult[0].yearlyIncome
                    : 0,
        });
    } catch (error) {
        console.error("GET ADMIN INCOME STATS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const getProductSalesAnalytics = async (req, res) => {
    try {
        const analytics = await Order.aggregate([
            {
                $match: {
                    orderStatus: { $ne: "cancelled" },
                    paymentStatus: { $ne: "failed" },
                },
            },

            {
                $unwind: "$items",
            },

            {
                $group: {
                    _id: "$items.productId",

                    productName: {
                        $first: "$items.productName",
                    },

                    productImage: {
                        $first: "$items.productImage",
                    },

                    unitsSold: {
                        $sum: "$items.quantity",
                    },

                    totalRevenue: {
                        $sum: {
                            $multiply: [
                                "$items.price",
                                "$items.quantity",
                            ],
                        },
                    },

                    orderCount: {
                        $sum: 1,
                    },

                    lastSoldAt: {
                        $max: "$createdAt",
                    },
                },
            },

            {
                $project: {
                    _id: 0,

                    productId: "$_id",

                    productName: 1,
                    productImage: 1,
                    unitsSold: 1,
                    totalRevenue: 1,
                    orderCount: 1,
                    lastSoldAt: 1,

                    averageSellingPrice: {
                        $cond: [
                            {
                                $gt: ["$unitsSold", 0],
                            },
                            {
                                $divide: [
                                    "$totalRevenue",
                                    "$unitsSold",
                                ],
                            },
                            0,
                        ],
                    },
                },
            },

            {
                $sort: {
                    totalRevenue: -1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            analytics,
        });
    } catch (error) {
        console.error(
            "GET PRODUCT SALES ANALYTICS ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};