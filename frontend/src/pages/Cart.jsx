import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setCart } from "@/redux/productSlice";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.product);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/cart",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.data.success) {
          dispatch(setCart(res.data.cart));
        }
      } catch (error) {
        console.error("FETCH CART ERROR:", error);
      }
    };

    if (accessToken) {
      fetchCart();
    }
  }, [accessToken, dispatch]);

  const [loadingItem, setLoadingItem] = useState(null);

  const items = cart?.items || [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const updateQuantity = async (productId, type) => {
    try {
      setLoadingItem(productId);

      const res = await axios.put(
        "http://localhost:8000/api/v1/cart/update",
        {
          productId,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }

    } catch (error) {
      console.error("UPDATE CART ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to update cart."
      );
    } finally {
      setLoadingItem(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setLoadingItem(productId);

      const res = await axios.delete(
        "http://localhost:8000/api/v1/cart/remove",
        {
          data: { productId },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));

        toast.success("Item removed from cart.");
      }
    } catch (error) {
      console.error("REMOVE CART ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to remove item."
      );
    } finally {
      setLoadingItem(null);
    }
  };

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <ShoppingBag className="w-9 h-9 text-gray-500" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Your cart is empty
        </h1>

        <p className="text-gray-500 mt-2 text-center">
          Looks like you haven't added anything to your cart yet.
        </p>

        <Link to="/products">
          <Button className="mt-6">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Your Cart
        </h1>

        <p className="text-gray-500 mt-2">
          {items.length} {items.length === 1 ? "item" : "items"} in
          your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

        {/* CART ITEMS */}
        <div className="space-y-4">

          {items.map((item) => {
            const product = item.productId;

            if (!product) return null;

            const productImage =
              product.productImg?.[0]?.url ||
              "/placeholder-product.png";

            const isLoading = loadingItem === product._id;

            return (
              <div
                key={product._id}
                className="border border-gray-200 rounded-xl p-4 md:p-5 bg-white"
              >
                <div className="flex gap-4">

                  {/* IMAGE */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={productImage}
                      alt={product.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between gap-3">
                      <div>
                        <h2 className="font-medium text-gray-900 text-base md:text-lg">
                          {product.productName}
                        </h2>

                        {product.brand && (
                          <p className="text-sm text-gray-500 mt-1">
                            {product.brand}
                          </p>
                        )}
                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeItem(product._id)
                        }
                        disabled={isLoading}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* PRICE */}
                    <p className="text-lg font-semibold text-gray-900 mt-3">
                      {formatPrice(item.price)}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center justify-between mt-4">

                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              "decrease"
                            )
                          }
                          disabled={
                            isLoading ||
                            item.quantity <= 1
                          }
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              product._id,
                              "increase"
                            )
                          }
                          disabled={isLoading}
                          className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                      </div>

                      {/* ITEM TOTAL */}
                      <p className="font-semibold text-gray-900">
                        {formatPrice(
                          item.price *
                          item.quantity
                        )}
                      </p>

                    </div>

                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:sticky lg:top-24 h-max">
          <div className="border border-gray-200 rounded-xl p-6 bg-white">

            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>
                  {formatPrice(cart.totalPrice)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>

                <span className="text-green-600 font-medium">
                  FREE
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>

                <span>
                  {formatPrice(cart.totalPrice)}
                </span>
              </div>

            </div>

            <Button className="w-full mt-6 h-12 text-base">
              Proceed to Checkout
            </Button>

            <Link
              to="/products"
              className="block text-center text-sm text-gray-500 hover:text-gray-900 mt-4"
            >
              Continue Shopping
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;