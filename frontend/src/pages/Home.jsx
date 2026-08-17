import React from "react";
import Hero from "@/components/hero";
import Features from "@/components/features";
import { useNavigate } from "react-router-dom";

import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";
import banner4 from "../assets/banner4.png";

const Home = () => {
    const navigate = useNavigate();

    const banners = [
        banner1,
        banner2,
        banner3,
        banner4,
    ];

    return (
        <div className="w-full bg-white">

            <Hero />

            <Features />

            {/*       DEALS / BANNERS       */}
            <section
                id="deals"
                className="banner-section"
            >
                <div className="banner-grid p-6">

                    {banners.map((banner, index) => (
                        <div
                            key={index}
                            onClick={() => navigate("/products")}
                            className="banner-card"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    navigate("/products");
                                }
                            }}
                        >
                            <img
                                src={banner}
                                alt={`ORYN promotional banner ${index + 1}`}
                                className="banner-image"
                                draggable="false"
                            />
                        </div>
                    ))}

                </div>
            </section>

        </div>
    );
};

export default Home;