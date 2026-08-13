import {ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import React from "react";

const Navbar = () => {
    const user=true;
    return (
        <header className="bg-pink-50 fixed w-full z-20 border-b border-pink-200">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-2">
                
                {/* Logo section */}
                <div>
                    <img
                        src="/ORYN.png"
                        alt="ORYN"
                        className="w-[100px]"
                    />
                </div>
                {/*nav section*/}
                <nav  className="flex gap-10 justify-between items-center">
                    <ul className="flex gap-7 items-center text-xl font-semibold">
                        <Link to={"/"}><li>Home</li></Link>
                        <Link to={"/products"}><li>Products</li></Link>
                        {
                            user && <Link to={"/profile"}><li>Hello, User.</li></Link>
                        }
                    </ul>
                    <Link to={"/cart"} className ="relative">
                        <ShoppingCart/>
                        <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2">0</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;