import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    ShoppingCart,
    User,
    MapPin,
    ChevronDown,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import axios from "axios";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    // REDUX USER
    const { user } = useSelector((store) => store.user);

    const accessToken = localStorage.getItem("accessToken");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // =========================
    // LOGOUT
    // =========================

    const logoutHandler = async () => {
        setMenuOpen(false);

        try {
            const res = await axios.post(
                "http://localhost:8000/api/v1/user/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.data.success) {
                dispatch(setUser(null));
                localStorage.removeItem("accessToken");

                toast.success(res.data.message);

                navigate("/");
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message || "Logout failed"
            );
        }
    };

    // =========================
    // USER DATA
    // =========================

    const userName = user?.firstName || "Guest";

    // Address display
    const addressText = [user?.city, user?.zipCode]
        .filter(Boolean)
        .join(" ");

    const hasAddress = Boolean(addressText);

    return (
        <nav className="bg-pink-800 text-white shadow-md sticky top-0 z-50">

            {/* =========================
                TOP NAVBAR
            ========================= */}

            <div className="border-b border-pink-700 sticky top-0 z-50">

                <div className="max-w-7xl mx-auto px-3 sm:px-6">

                    <div className="h-16 flex items-center justify-between">

                        {/* =========================
                            LEFT : HAMBURGER + LOGO
                        ========================= */}

                        <div className="flex items-center gap-2 sm:gap-4">

                            {/* MOBILE HAMBURGER */}

                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="md:hidden p-2 rounded-md hover:bg-pink-700 transition"
                                aria-label="Open menu"
                            >
                                {menuOpen ? (
                                    <X size={25} />
                                ) : (
                                    <Menu size={25} />
                                )}
                            </button>

                            {/* LOGO */}

                            <Link
                                to="/"
                                className="flex items-center"
                            >
                                <img
                                    src="/ORYN-white.png"
                                    alt="ORYN"
                                    className="h-9 sm:h-10 w-auto object-contain"
                                />
                            </Link>

                        </div>

                        {/* =========================
                            DESKTOP NAVIGATION
                        ========================= */}

                        <div className="hidden md:flex items-center gap-7">

                            <Link
                                to="/"
                                className="font-semibold text-lg hover:text-pink-200 transition"
                            >
                                Home
                            </Link>

                            <Link
                                to="/products"
                                className="font-semibold text-lg hover:text-pink-200 transition"
                            >
                                Products
                            </Link>

                            {/* PROFILE */}

                            {user && user._id && (
                                <Link
                                    to={`/profile/${user._id}`}
                                    className="flex items-center gap-2 font-semibold text-lg hover:text-pink-200 transition"
                                >
                                    <User size={21} />

                                    Hello, {userName}
                                </Link>
                            )}

                            {/* CART */}

                            <Link
                                to="/cart"
                                className="relative p-2 hover:text-pink-200 transition"
                            >
                                <ShoppingCart size={30} />

                                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            {/* LOGIN / LOGOUT */}

                            {user ? (
                                <Button
                                    onClick={logoutHandler}
                                    className="bg-pink-600 hover:bg-pink-500 text-white font-semibold p-5 text-md"
                                >
                                    Logout
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => navigate("/login")}
                                    className="bg-gradient-to-r from-purple-900 to-blue-600 text-white font-semibold p-5 text-md"
                                >
                                    Login
                                </Button>
                            )}

                        </div>

                        {/* =========================
                            MOBILE USER + CART
                        ========================= */}

                        <div className="md:hidden flex items-center gap-3">

                            {/* MOBILE PROFILE */}

                            {user && user._id && (
                                <Link
                                    to={`/profile/${user._id}`}
                                    className="p-1"
                                    aria-label="Profile"
                                >
                                    <User size={23} />
                                </Link>
                            )}

                            {/* MOBILE CART */}

                            <Link
                                to="/cart"
                                className="relative p-1"
                                aria-label="Cart"
                            >
                                <ShoppingCart size={27} />

                                <span className="absolute -top-1 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

            {/* =========================
                DELIVERY BAR
            ========================= */}

            {/* =========================
    DELIVERY BAR
========================= */}

            <div className="bg-pink-900 border-b border-pink-700">

                <div className="max-w-7xl mx-auto px-3 sm:px-6">

                    <div className="min-h-12 flex items-center gap-2">

                        {/* ADDRESS ICON */}
                        {user && user._id ? (
                            <Link
                                to={`/profile/${user._id}`}
                                aria-label="Manage delivery address"
                            >
                                <MapPin
                                    size={28}
                                    className="shrink-0 hover:text-pink-200 transition"
                                />
                            </Link>
                        ) : (
                            <Link
                                to="/signup"
                                aria-label="Sign up to add an address"
                            >
                                <MapPin
                                    size={28}
                                    className="shrink-0 hover:text-pink-200 transition"
                                />
                            </Link>
                        )}

                        <div className="flex flex-col leading-tight">

                            <span className="text-[11px] sm:text-xs text-pink-200">
                                Deliver to {userName}
                            </span>

                            {/* LOGGED-IN USER */}
                            {user && user._id ? (

                                hasAddress ? (

                                    <Link
                                        to={`/profile/${user._id}`}
                                        className="flex items-center gap-1 text-sm sm:text-base font-semibold hover:text-pink-200 transition"
                                    >
                                        {user.city} {user.zipCode}
                                    </Link>

                                ) : (

                                    <Link
                                        to={`/profile/${user._id}`}
                                        className="text-sm sm:text-base font-semibold hover:text-pink-200 transition"
                                    >
                                        Add Address
                                    </Link>

                                )

                            ) : (

                                /* LOGGED-OUT USER */
                                <Link
                                    to="/signup"
                                    className="text-sm sm:text-base font-semibold hover:text-pink-200 transition"
                                >
                                    Sign Up to Add Address
                                </Link>

                            )}

                        </div>

                        <ChevronDown
                            size={14}
                            className="shrink-0"
                        />

                    </div>

                </div>

            </div>

            {/* =========================
                MOBILE SLIDE MENU
            ========================= */}

            {menuOpen && (

                <div className="md:hidden absolute top-full left-0 w-full bg-pink-800 shadow-lg border-t border-pink-700">

                    <div className="p-3 space-y-1">

                        {/* HOME */}

                        <Link
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 rounded-lg font-semibold text-lg hover:bg-pink-700"
                        >
                            Home
                        </Link>

                        {/* PRODUCTS */}

                        <Link
                            to="/products"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 rounded-lg font-semibold text-lg hover:bg-pink-700"
                        >
                            Products
                        </Link>

                        {/* PROFILE */}

                        {user && user._id && (
                            <Link
                                to={`/profile/${user._id}`}
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-3 rounded-lg font-semibold text-lg hover:bg-pink-700"
                            >
                                My Profile
                            </Link>
                        )}

                        {/* CART */}

                        <Link
                            to="/cart"
                            onClick={() => setMenuOpen(false)}
                            className="block px-4 py-3 rounded-lg font-semibold text-lg hover:bg-pink-700"
                        >
                            Cart
                        </Link>

                        {/* LOGIN / LOGOUT */}

                        {user ? (
                            <button
                                type="button"
                                onClick={logoutHandler}
                                className="w-full text-left px-4 py-3 rounded-lg font-semibold text-lg hover:bg-pink-700"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
                                    navigate("/login");
                                }}
                                className="w-full text-left px-4 py-3 rounded-lg font-semibold text-lg hover:bg-pink-700"
                            >
                                Login
                            </button>
                        )}

                    </div>

                </div>

            )}

        </nav>
    );
};

export default Navbar;