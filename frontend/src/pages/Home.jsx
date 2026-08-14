import React from "react";
import Navbar from "../components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";

const Home = () => {
    return (
        <div>
            <Navbar/>
            <Hero/>
            <Features/>

            <h1>Home</h1>
        </div>
    );
};

export default Home;