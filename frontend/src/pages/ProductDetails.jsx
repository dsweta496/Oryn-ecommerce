import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart,
    Minus,
    Plus,
    ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import axios from "axios";
import.meta.env.VITE_API_URL;

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.product);

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addingToCart, setAddingToCart] = useState(false);

    // NEW: controls Read more / Read less
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    // Fetch product
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/v1/product/${productId}`
                );

                if (res.data.success) {
                    setProduct(res.data.product);
                }
            } catch (error) {
                console.error("FETCH PRODUCT ERROR:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load product."
                );

                navigate("/products");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, navigate]);
    useEffect(() => {
        if (!product || !cart?.items) return;

        const cartItem = cart.items.find(
            (item) => item.productId?._id === product._id
        );

        if (cartItem) {
            setQuantity(cartItem.quantity);
        } else {
            setQuantity(1);
        }
    }, [product, cart]);

    // Quantity controls
    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    // Add to cart
    // Add to cart
    const addToCart = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            navigate("/signup");
            return;
        }

        try {
            setAddingToCart(true);

            const existingCartItem = cart?.items?.find(
                (item) => item.productId?._id === product._id
            );

            let updatedCart;

            // Product already exists in cart
            // → SET its quantity to the selected quantity
            if (existingCartItem) {
                const res = await axios.put(
                    `${import.meta.env.VITE_API_URL}/api/v1/cart/update`,
                    {
                        productId: product._id,
                        quantity: quantity,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (res.data.success) {
                    updatedCart = res.data.cart;
                }
            }

            // Product is not in cart yet
            // → Add it with the selected quantity
            else {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/v1/cart/add`,
                    {
                        productId: product._id,
                        quantity: quantity,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (res.data.success) {
                    updatedCart = res.data.cart;
                }
            }

            if (updatedCart) {
                dispatch(setCart(updatedCart));
                toast.success("Cart updated successfully.");
            }

        } catch (error) {
            console.error("ADD TO CART ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update cart."
            );
        } finally {
            setAddingToCart(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-gray-500">
                    Loading product...
                </p>
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-semibold">
                    Product not found
                </h2>

                <Button onClick={() => navigate("/products")}>
                    Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-10 py-6 lg:py-8">

            {/* Back button */}
            <button
                onClick={() => navigate("/products")}
                className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors mb-6 lg:mb-8"
            >
                <ArrowLeft size={18} />
                Back to Products
            </button>

            <div className="max-w-7xl mx-auto">

                {/*        MAIN PRODUCT LAYOUT        */}
                <div className="grid p-8 grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">

                           
                    {/* LEFT — PRODUCT IMAGES */}
                           

                    <div className="w-full">

                        {/* Desktop: thumbnails beside image */}
                        <div className="hidden sm:flex gap-4">

                            {/* Thumbnails */}
                            {product.productImg?.length > 1 && (
                                <div className="flex flex-col gap-3 w-20 flex-shrink-0">
                                    {product.productImg.map((image, index) => (
                                        <button
                                            key={
                                                image.public_id || index
                                            }
                                            onClick={() =>
                                                setSelectedImage(index)
                                            }
                                            className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-gray-50 ${selectedImage === index
                                                ? "border-pink-600"
                                                : "border-gray-200"
                                                }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${product.productName} ${index + 1
                                                    }`}
                                                className="w-full h-full object-contain"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main image */}
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-full h-[420px] lg:h-[500px] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
                                    {product.productImg?.length > 0 ? (
                                        <img
                                            src={
                                                product.productImg[
                                                    selectedImage
                                                ]?.url
                                            }
                                            alt={product.productName}
                                            className="w-full h-full object-contain p-8"
                                        />
                                    ) : (
                                        <div className="text-gray-400">
                                            No image available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                               
                        {/* MOBILE IMAGE */}
                               

                        <div className="sm:hidden">

                            <div className="w-full aspect-square max-h-[380px] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
                                {product.productImg?.length > 0 ? (
                                    <img
                                        src={
                                            product.productImg[
                                                selectedImage
                                            ]?.url
                                        }
                                        alt={product.productName}
                                        className="w-full h-full object-contain p-6"
                                    />
                                ) : (
                                    <div className="text-gray-400">
                                        No image available
                                    </div>
                                )}
                            </div>

                            {/* Mobile thumbnails */}
                            {product.productImg?.length > 1 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                    {product.productImg.map(
                                        (image, index) => (
                                            <button
                                                key={
                                                    image.public_id ||
                                                    index
                                                }
                                                onClick={() =>
                                                    setSelectedImage(index)
                                                }
                                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 bg-gray-50 ${selectedImage === index
                                                    ? "border-pink-600"
                                                    : "border-gray-200"
                                                    }`}
                                            >
                                                <img
                                                    src={image.url}
                                                    alt={`${product.productName} ${index + 1
                                                        }`}
                                                    className="w-full h-full object-contain"
                                                />
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                           
                    {/* RIGHT — PRODUCT INFORMATION */}
                           

                    <div className="flex flex-col  lg:tp-14">

                        {/* Brand */}
                        <p className="text-sm text-pink-600 font-semibold uppercase tracking-wide">
                            {product.brand}
                        </p>

                        {/* Product name */}
                        <h1 className="text-xl sm:text-3xl lg:text-3xl font-bold mt-2 text-gray-900 leading-tight">
                            {product.productName}
                        </h1>

                        {/* Price */}
                        <p className="text-xl sm:text-3xl font-bold mt-4 text-gray-900">
                            ₹ {product.productPrice}
                        </p>

                        {/* Category */}
                        <div className="mt-4">
                            <span className="text-sm text-gray-500">
                                Category
                            </span>

                            <p className="font-medium text-gray-800 mt-1">
                                {product.category}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-5" />

                               
                        {/* DESCRIPTION */}
                               

                        <div>
                            <h2 className="text-lg font-semibold mb-2">
                                Description
                            </h2>

                            <p
                                className={`text-gray-600 leading-7 ${!descriptionExpanded
                                    ? "line-clamp-4"
                                    : ""
                                    }`}
                            >
                                {product.productDesc}
                            </p>

                            {/* Only show Read More when description is long */}
                            {product.productDesc?.length > 180 && (
                                <button
                                    onClick={() =>
                                        setDescriptionExpanded(
                                            (prev) => !prev
                                        )
                                    }
                                    className="mt-2 text-pink-600 font-medium hover:text-pink-700 transition-colors"
                                >
                                    {descriptionExpanded
                                        ? "Read less"
                                        : "Read more..."}
                                </button>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="mt-8">
                            <p className="font-semibold mb-3">
                                Quantity
                            </p>

                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden w-fit">

                                {/* Minus */}
                                <button
                                    type="button"
                                    onClick={decreaseQuantity}
                                    disabled={quantity === 1 || addingToCart}
                                    className="w-12 h-12 flex items-center justify-center
                       text-gray-700
                       hover:bg-gray-100
                       transition-colors
                       disabled:opacity-40
                       disabled:cursor-not-allowed"
                                >
                                    <Minus size={18} />
                                </button>

                                {/* Quantity */}
                                <span className="w-12 h-12 flex items-center justify-center font-semibold text-gray-900">
                                    {quantity}
                                </span>

                                {/* Plus */}
                                <button
                                    type="button"
                                    onClick={increaseQuantity}
                                    disabled={addingToCart}
                                    className="w-12 h-12 flex items-center justify-center
                                     text-gray-700
                                     hover:bg-gray-100
                                     transition-colors
                                     disabled:opacity-40
                                      disabled:cursor-not-allowed"
                                >
                                    <Plus size={18} />
                                </button>

                            </div>
                        </div>

                               
                        {/* ADD TO CART */}
                               

                        <Button
                            onClick={addToCart}
                            disabled={addingToCart}
                            className="mt-6 bg-pink-600 hover:bg-pink-700 w-full sm:w-fit min-w-[200px] py-6 text-base"
                        >
                            <ShoppingCart size={20} />

                            {addingToCart
                                ? "Adding..."
                                : "Add to Cart"}
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;