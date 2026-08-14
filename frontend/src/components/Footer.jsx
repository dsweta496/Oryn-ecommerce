import React from 'react'
import { Link } from 'react-router-dom'
import {
    FaFacebook,
    FaInstagram,
    FaPinterest,
    FaTwitter
} from 'react-icons/fa'

const Footer = () => {
    return (
        <footer className="bg-[#020617] text-gray-200 py-10">
            <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                   {/* Store Information */}
                   <div className="min-w-0">
                    <Link to="/">
                        <img
                            src="/ORYN.png"
                            alt="ORYN"
                            className="w-32 mb-4"
                        />
                    </Link>

                    <p className="text-sm mb-3">
                        Powering Your World with the Best in Electronics.
                    </p>

                    <p className="text-sm">
                        123 Electronics St, Style City, NY 10001
                    </p>

                    <p className="text-sm">
                        Email: support@oryn.com
                    </p>

                    <p className="text-sm">
                        Phone: (123) 456-7890
                    </p>
                   </div>


                   {/* Customer Service */}
                   <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-3">
                        Customer Service
                    </h3>

                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-gray-100 transition-colors cursor-pointer">
                            Contact Us
                        </li>
                        <li className="hover:text-gray-100 transition-colors cursor-pointer">
                            Shipping & Returns
                        </li>
                        <li className="hover:text-gray-100 transition-colors cursor-pointer">
                            FAQs
                        </li>
                        <li className="hover:text-gray-100 transition-colors cursor-pointer">
                            Order Tracking
                        </li>
                        <li className="hover:text-gray-100 transition-colors cursor-pointer">
                            Size Guide
                        </li>
                    </ul>
                   </div>


                   {/* Newsletter + Social Media */}
                   <div className="min-w-0">

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3">
                            Stay in the Loop
                        </h3>

                        <p className="text-sm mb-5 max-w-sm">
                            Subscribe to get special offers, free giveaways,
                            and more.
                        </p>

                        <div className="flex w-full max-w-md items-center gap-3">

                            <input
                                type="email"
                                placeholder="Your email address"
                                className="
                        min-w-0 flex-1
                        bg-transparent
                        border-0 border-b border-gray-600
                        outline-none
                        px-3 py-3
                        text-white
                        placeholder-gray-500
                        hover:border-gray-400
                        focus:border-pink-500
                        transition-colors duration-300
                    "
                            />

                            <button
                                className="
                        shrink-0
                        bg-pink-600
                        text-white
                        px-6 py-3
                        rounded-xl
                        font-semibold
                        transition-all duration-300
                        hover:bg-pink-500
                    "
                            >
                                Subscribe
                            </button>

                        </div>
                    </div>


                    {/* Follow Us */}
                    <div className="mt-8">

                        <h3 className="text-lg font-semibold text-white mb-3">
                            Follow Us
                        </h3>

                        <div className="flex gap-4">
                            <FaFacebook
                                className="cursor-pointer transition-colors duration-300 hover:text-pink-500"
                            />

                            <FaInstagram
                                className="cursor-pointer transition-colors duration-300 hover:text-pink-500"
                            />

                            <FaTwitter
                                className="cursor-pointer transition-colors duration-300 hover:text-pink-500"
                            />

                            <FaPinterest
                                className="cursor-pointer transition-colors duration-300 hover:text-pink-500"
                            />
                        </div>

                    </div>

                   </div>

                </div>

            </div>

        </footer >
    )
}

export default Footer