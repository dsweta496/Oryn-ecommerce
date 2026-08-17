import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import.meta.env.VITE_API_URL;

import {
  CreditCard,
  Banknote,
  MapPin,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";


const Checkout = () => {
  const navigate = useNavigate();

  const { user } = useSelector((store) => store.user);
  const { cart } = useSelector((store) => store.product);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });


      
  // LOAD RAZORPAY CHECKOUT SCRIPT
      

  useEffect(() => {
    if (window.Razorpay) {
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => {
      console.log("Razorpay Checkout loaded successfully.");
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout.");
      toast.error(
        "Unable to load Razorpay. Please check your internet connection."
      );
    };

    document.body.appendChild(script);

    return () => {
      // Do not remove the script here.
      // Razorpay may still be needed after component updates.
    };
  }, []);


      
  // REDIRECT IF CART EMPTY
      

  useEffect(() => {
    if (!cart?.items?.length) {
      navigate("/cart");
    }
  }, [cart, navigate]);


      
  // LOAD USER ADDRESS
      

  useEffect(() => {
    if (user) {
      setShippingAddress({
        fullName:
          `${user.firstName || ""} ${user.lastName || ""}`.trim(),

        phone:
          user.phoneNumber ||
          user.phone ||
          "",

        address:
          user.address ||
          "",

        city:
          user.city ||
          "",

        state:
          user.state ||
          "",

        pincode:
          user.zipCode ||
          "",
      });
    }
  }, [user]);


      
  // ADDRESS CHANGE
      

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


      
  // COD ORDER
      

  const placeCODOrder = async () => {
    try {
      setLoading(true);

      const accessToken =
        localStorage.getItem("accessToken");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/order/cod`,
        {
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Order placed successfully!");

        navigate(`/profile/${user._id}?tab=orders`);
      }

    } catch (error) {
      console.error("COD ORDER ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to place order."
      );

    } finally {
      setLoading(false);
    }
  };


      
  // CREATE RAZORPAY ORDER
      

  const startRazorpayPayment = async () => {
    try {
      setLoading(true);

      // Make sure Razorpay script has loaded
      if (!window.Razorpay) {
        toast.error(
          "Razorpay is still loading. Please try again."
        );

        setLoading(false);
        return;
      }

      const accessToken =
        localStorage.getItem("accessToken");


      // --------------------------------------------------
      // CREATE ORDER ON OUR BACKEND
      // --------------------------------------------------

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/order/razorpay/create`,
        {
          shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );


      if (!res.data.success) {
        throw new Error(
          res.data.message ||
            "Unable to create Razorpay order."
        );
      }


      const razorpayOrder =
        res.data.razorpayOrder;

      const razorpayKey =
        res.data.key;


      // --------------------------------------------------
      // RAZORPAY CHECKOUT OPTIONS
      // --------------------------------------------------

      const options = {

        key: razorpayKey,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        name: "ORYN",

        description: "ORYN Test Order",

        order_id: razorpayOrder.id,


        // ------------------------------------------------
        // PREFILL USER INFORMATION
        // ------------------------------------------------

        prefill: {
          name:
            shippingAddress.fullName ||
            "",

          email:
            user?.email ||
            "",

          contact:
            shippingAddress.phone ||
            "",
        },


        // ------------------------------------------------
        // THEME
        // ------------------------------------------------

        theme: {
          color: "#e5007d",
        },


        // ------------------------------------------------
        // PAYMENT SUCCESS
        // ------------------------------------------------

        handler: async function (response) {

          try {

            setLoading(true);

            console.log(
              "RAZORPAY SUCCESS:",
              response
            );


            const verifyResponse =
              await axios.post(

                `${import.meta.env.VITE_API_URL}/api/v1/order/razorpay/verify`,

                {
                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },

                {
                  headers: {
                    Authorization:
                      `Bearer ${accessToken}`,
                  },
                }

              );


            if (
              verifyResponse.data.success
            ) {

              toast.success(
                "Payment successful! Order placed."
              );

              navigate(
                `/profile/${user._id}?tab=orders`
              );

            } else {

              toast.error(
                "Payment verification failed."
              );

            }

          } catch (error) {

            console.error(
              "RAZORPAY VERIFICATION ERROR:",
              error
            );

            toast.error(
              error?.response?.data?.message ||
                "Payment verification failed."
            );

          } finally {

            setLoading(false);

          }
        },


        // ------------------------------------------------
        // PAYMENT FAILED
        // ------------------------------------------------

        modal: {

          ondismiss: function () {

            console.log(
              "Razorpay checkout closed."
            );

            setLoading(false);

          },

        },


        // ------------------------------------------------
        // NOTES
        // ------------------------------------------------

        notes: {

          address:
            `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`,

        },


        // ------------------------------------------------
        // PAYMENT FAILURE EVENT
        // ------------------------------------------------

        callback_url: undefined,

      };


      // --------------------------------------------------
      // OPEN RAZORPAY
      // --------------------------------------------------

      const razorpay =
        new window.Razorpay(options);


      // --------------------------------------------------
      // HANDLE FAILED PAYMENT
      // --------------------------------------------------

      razorpay.on(
        "payment.failed",
        async function (response) {

          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );


          try {

            await axios.post(

                `${import.meta.env.VITE_API_URL}/api/v1/order/razorpay/failed`,

              {
                razorpay_order_id:
                  response?.error?.metadata?.order_id ||
                  razorpayOrder.id,
              },

              {
                headers: {
                  Authorization:
                    `Bearer ${accessToken}`,
                },
              }

            );

          } catch (error) {

            console.error(
              "FAILED PAYMENT UPDATE ERROR:",
              error
            );

          }


          toast.error(
            response?.error?.description ||
              "Payment failed. You can try again."
          );

          setLoading(false);
        }
      );


      razorpay.open();

    } catch (error) {

      console.error(
        "RAZORPAY ORDER ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Unable to start Razorpay payment."
      );

      setLoading(false);
    }
  };


      
  // PLACE ORDER
      

  const handlePlaceOrder = () => {

    // ----------------------------------------------------
    // VALIDATE ADDRESS
    // ----------------------------------------------------

    if (!shippingAddress.fullName.trim()) {
      toast.error(
        "Please enter your full name."
      );
      return;
    }


    if (!shippingAddress.phone.trim()) {
      toast.error(
        "Please enter your phone number."
      );
      return;
    }


    if (!shippingAddress.address.trim()) {
      toast.error(
        "Please enter your address."
      );
      return;
    }


    if (!shippingAddress.city.trim()) {
      toast.error(
        "Please enter your city."
      );
      return;
    }


    if (!shippingAddress.state.trim()) {
      toast.error(
        "Please enter your state."
      );
      return;
    }


    if (!shippingAddress.pincode.trim()) {
      toast.error(
        "Please enter your pincode."
      );
      return;
    }


    // ----------------------------------------------------
    // SELECT PAYMENT METHOD
    // ----------------------------------------------------

    if (paymentMethod === "cod") {

      placeCODOrder();

    } else {

      startRazorpayPayment();

    }
  };


      
  // EMPTY CART
      

  if (!cart?.items?.length) {
    return null;
  }


      
  // UI
      

  return (

    <div className="min-h-screen bg-gray-50 py-8 px-4">

      <div className="max-w-6xl mx-auto">


        {/* TOP HEADER */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-pink-700 transition mb-5"
          >

            <ArrowLeft className="w-5 h-5" />

            Back to Cart

          </button>


          <div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Checkout
            </h1>

            <p className="text-gray-500 mt-2">
              Complete your order securely.
            </p>

          </div>

        </div>


        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


          {/* LEFT */}

          <div className="lg:col-span-2 space-y-6">


            {/* SHIPPING ADDRESS */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">

                  <MapPin className="w-5 h-5 text-pink-700" />

                </div>


                <div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipping Address
                  </h2>

                  <p className="text-sm text-gray-500">
                    Where should we deliver your order?
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={shippingAddress.fullName}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />


                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={shippingAddress.phone}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />


                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={shippingAddress.address}
                  onChange={handleAddressChange}
                  className="w-full md:col-span-2 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />


                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />


                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />


                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={shippingAddress.pincode}
                  onChange={handleAddressChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />

              </div>

            </div>


            {/* PAYMENT METHOD */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">

                  <CreditCard className="w-5 h-5 text-pink-700" />

                </div>


                <div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-gray-500">
                    Choose how you'd like to pay.
                  </p>

                </div>

              </div>


              <div className="space-y-3">


                {/* COD */}

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("cod");
                  }}
                  className={`w-full border-2 rounded-2xl p-5 flex items-center gap-4 text-left transition-all cursor-pointer ${
                    paymentMethod === "cod"
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300 bg-white"
                  }`}
                >

                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      paymentMethod === "cod"
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >

                    <Banknote className="w-6 h-6 text-green-600" />

                  </div>


                  <div className="flex-1">

                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Pay when your order arrives.
                    </p>

                  </div>


                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod"
                        ? "border-pink-600"
                        : "border-gray-300"
                    }`}
                  >

                    {paymentMethod === "cod" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-600" />
                    )}

                  </div>

                </button>


                {/* RAZORPAY */}

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("razorpay");
                  }}
                  className={`w-full border-2 rounded-2xl p-5 flex items-center gap-4 text-left transition-all cursor-pointer ${
                    paymentMethod === "razorpay"
                      ? "border-pink-600 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300 bg-white"
                  }`}
                >

                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      paymentMethod === "razorpay"
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >

                    <CreditCard className="w-6 h-6 text-blue-600" />

                  </div>


                  <div className="flex-1">

                    <p className="font-semibold text-gray-900">
                      Razorpay
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Secure test payment gateway.
                    </p>

                  </div>


                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "razorpay"
                        ? "border-pink-600"
                        : "border-gray-300"
                    }`}
                  >

                    {paymentMethod === "razorpay" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-600" />
                    )}

                  </div>

                </button>

              </div>

            </div>

          </div>


          {/* RIGHT — ORDER SUMMARY */}

          <div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:sticky lg:top-24">


              <div className="flex items-center gap-3 mb-6">

                <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">

                  <ShoppingBag className="w-5 h-5 text-pink-700" />

                </div>


                <h2 className="text-xl font-semibold text-gray-900">
                  Order Summary
                </h2>

              </div>


              {/* PRODUCTS */}

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">

                {cart.items.map((item) => (

                  <div
                    key={item._id}
                    className="flex gap-3"
                  >

                    <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden">

                      <img
                        src={
                          item.productId
                            ?.productImg?.[0]?.url
                        }
                        alt={
                          item.productId?.productName ||
                          "Product"
                        }
                        className="w-full h-full object-contain"
                      />

                    </div>


                    <div className="flex-1 min-w-0">

                      <p className="font-medium text-gray-900 truncate">
                        {item.productId?.productName}
                      </p>


                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>


                      <p className="font-semibold text-gray-900 mt-1">

                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toLocaleString("en-IN")}

                      </p>

                    </div>

                  </div>

                ))}

              </div>


              {/* TOTALS */}

              <div className="border-t mt-6 pt-5 space-y-3">

                <div className="flex justify-between text-gray-600">

                  <span>
                    Subtotal
                  </span>

                  <span>

                    ₹
                    {cart.totalPrice?.toLocaleString(
                      "en-IN"
                    )}

                  </span>

                </div>


                <div className="flex justify-between text-gray-600">

                  <span>
                    Delivery
                  </span>

                  <span className="text-green-600 font-medium">
                    FREE
                  </span>

                </div>


                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">

                  <span>
                    Total
                  </span>

                  <span>

                    ₹
                    {cart.totalPrice?.toLocaleString(
                      "en-IN"
                    )}

                  </span>

                </div>

              </div>


              {/* PLACE ORDER */}

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-6 bg-pink-700 hover:bg-pink-800 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >

                {loading
                  ? "Processing..."
                  : paymentMethod === "cod"
                  ? "Place COD Order"
                  : "Continue to Razorpay"}

              </button>


              {/* SECURITY */}

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">

                <ShieldCheck className="w-4 h-4 text-green-600" />

                Secure checkout

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};


export default Checkout;