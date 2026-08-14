import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import axios from "axios";

const Navbar = () => {
    const { user } = useSelector(store => store.user)
    const accessToken = localStorage.getItem('accessToken')
    const dispatch = useDispatch()

    const logoutHandler = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/api/v1/user/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (res.data.success) {
                localStorage.removeItem("accessToken");
                dispatch(setUser(null));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(
                error.response?.data?.message || "Logout failed"
            );
        }
    };
    return (
        <header className="bg-pink-900 fixed w-full z-20 border-b border-pink-700">
            <div className="max-w-7xl mx-auto px-8 py-2 flex justify-between items-center">
                {/* Logo section */}
                <div className="">
                    <img
                        src="/ORYN-white.png"
                        alt="ORYN"
                        className="w-[120px]"
                    />
                </div>
                {/*nav section*/}
                <nav className="flex gap-10 justify-between items-center">
                    <ul className="flex gap-7 items-center text-xl text-pink-100 font-semibold">
                        <Link to={"/"}><li>Home</li></Link>
                        <Link to={"/products"}><li>Products</li></Link>
                        {
                            user && <Link to={"/profile"}><li>Hello, {user.firstName}</li></Link>
                        }
                    </ul>
                    <Link to={"/cart"} className="relative p-2 flex items-center">
                        <ShoppingCart className="text-pink-50 w-7 h-7" />

                        <span className="absolute -top-1 -right-1 bg-pink-500 rounded-full 
                     text-white text-xs min-w-5 h-5 flex items-center justify-center px-1">
                            0
                        </span>
                    </Link>
                    {
                        user ? (
                            <Button
                                onClick={logoutHandler}
                                className="bg-pink-600 text-white text-xl cursor-pointer p-5"
                            >
                                Logout
                            </Button>
                        ) : (
                            <Link to="/login">
                                <Button className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white text-xl cursor-pointer p-5">
                                    Login
                                </Button>
                            </Link>
                        )
                    }
                </nav>
            </div>
        </header>
    );
};

export default Navbar;