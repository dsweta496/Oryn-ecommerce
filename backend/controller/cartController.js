import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";


export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.json({ success: true, cart: [] })
        }
        res.status(200).json({ success: true, cart })

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

export const addToCart = async (req, res) => {

    try {
        const userId = req.id;
        const { productId, quantity = 1 } = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            })
        }

        let cart = await Cart.findOne({ userId })

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{
                    productId,
                    quantity,
                    price: product.productPrice
                }],
                totalPrice: product.productPrice * quantity
            })
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            )
            if (itemIndex !== -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({
                    productId,
                    quantity,
                    price: product.productPrice
                });

            }
            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
        }
        await cart.save();

        const populatedCart = await Cart.findById(cart._id)
            .populate("items.productId");

        res.status(200).json({
            success: true,
            message: "Product added successfully.",
            cart: populatedCart
        })

    } catch (error) {
        console.error("ADD TO CART ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const item = cart.items.find(
            item => item.productId.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found."
            });
        }

        // Product Details page:
        // Set quantity directly
        if (quantity !== undefined) {
            const newQuantity = Number(quantity);

            if (!Number.isInteger(newQuantity) || newQuantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quantity."
                });
            }

            item.quantity = newQuantity;
        }

        // Cart page:
        // Keep existing + / - functionality
        else if (type === "increase") {
            item.quantity += 1;
        }

        else if (type === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        await cart.save();

        cart = await cart.populate("items.productId");

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error("UPDATE QUANTITY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        await cart.save();

        cart = await cart.populate("items.productId");
        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}