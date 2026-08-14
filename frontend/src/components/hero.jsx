import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";

const Hero = () => {

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

    return (
        <section className="bg-gradient-to-r from-pink-600 to-purple-950 text-white py-16">

            <div className="max-w-7xl mx-auto px-4">

                <div className="grid md:grid-cols-2 gap-8 items-center">

                    {/* LEFT SIDE */}
                    <div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-4 ml-8">
                            Latest Electronics at best prices
                        </h1>

                        <p className="text-2xl mb-6 text-blue-100 ml-8">
                            Discover cutting-edge technology with unbeatable
                            deals on smartphones, laptops and more...
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 ml-8">

                            <Button className="bg-white text-xl cursor-pointer p-5 text-pink-800 hover:bg-gray-100">
                                Shop Now
                            </Button>

                            <Button
                                variant="outline"
                                className="border-white text-white text-xl cursor-pointer p-5 hover:text-pink-800 hover:bg-white bg-transparent"
                            >
                                View Deals
                            </Button>

                        </div>

                    </div>


                    {/* RIGHT SIDE - AUTO CAROUSEL */}
                    <div className="relative flex justify-center items-center h-[400px] overflow-hidden">
                        <img
                            key={currentImage}
                            src={images[currentImage]}
                            alt="Featured product"
                            className="max-h-[380px] max-w-full object-contain animate-slideIn"
                        />

                    </div>

                </div>

            </div>

        </section>
    );
};

export default Hero;