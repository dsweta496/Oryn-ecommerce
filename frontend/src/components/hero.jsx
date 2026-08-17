import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    const images = [
        "/Hero1.png",
        "/Hero2.png",
        "/Hero3.png",
    ];

    const [currentImage, setCurrentImage] = useState(0);

    // Change image every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // Scroll to the deals/banners section
    const handleViewDeals = () => {
        document.getElementById("deals")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <section className="bg-gradient-to-r from-pink-600 to-purple-950 text-white overflow-hidden">

            <div
                className="
                    max-w-7xl
                    mx-auto
                    px-5
                    sm:px-6
                    lg:px-8
                    py-10
                    sm:py-14
                    lg:py-16
                "
            >

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-8
                        lg:gap-12
                        items-center
                    "
                >

                    {/*   LEFT SIDE   */}
                    <div
                        className="
                            text-center
                            md:text-left
                            flex
                            flex-col
                            items-center
                            md:items-start
                        "
                    >

                        <h1
                            className="
                                text-4xl
                                sm:text-5xl
                                lg:text-6xl
                                font-bold
                                leading-[1.05]
                                mb-5
                                max-w-xl
                            "
                        >
                            Latest Electronics at best prices
                        </h1>

                        <p
                            className="
                                text-base
                                sm:text-lg
                                lg:text-xl
                                leading-relaxed
                                mb-7
                                text-blue-100
                                max-w-lg
                            "
                        >
                            Discover cutting-edge technology with unbeatable
                            deals on smartphones, laptops and more...
                        </p>

                        {/* BUTTONS */}
                        <div
                            className="
                                flex
                                flex-col
                                sm:flex-row
                                gap-3
                                w-full
                                sm:w-auto
                            "
                        >

                            {/* SHOP NOW */}
                            <Button
                                onClick={() => navigate("/products")}
                                className="
                                    w-full
                                    sm:w-auto
                                    bg-white
                                    text-base
                                    sm:text-lg
                                    cursor-pointer
                                    px-7
                                    py-3
                                    text-pink-800
                                    hover:bg-gray-100
                                "
                            >
                                Shop Now
                            </Button>

                            {/* VIEW DEALS */}
                            <Button
                                variant="outline"
                                onClick={handleViewDeals}
                                className="
                                    w-full
                                    sm:w-auto
                                    border-white
                                    text-white
                                    text-base
                                    sm:text-lg
                                    cursor-pointer
                                    px-7
                                    py-3
                                    hover:text-pink-800
                                    hover:bg-white
                                    bg-transparent
                                "
                            >
                                View Deals
                            </Button>

                        </div>
                    </div>


                    {/*   RIGHT SIDE   */}
                    <div
                        className="
                            relative
                            flex
                            justify-center
                            items-center
                            h-[260px]
                            sm:h-[320px]
                            lg:h-[400px]
                            overflow-hidden
                        "
                    >

                        <img
                            key={currentImage}
                            src={images[currentImage]}
                            alt="Featured product"
                            className="
                                w-full
                                max-w-[280px]
                                sm:max-w-[360px]
                                lg:max-w-full
                                max-h-[250px]
                                sm:max-h-[310px]
                                lg:max-h-[380px]
                                object-contain
                                animate-slideIn
                            "
                        />

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Hero;