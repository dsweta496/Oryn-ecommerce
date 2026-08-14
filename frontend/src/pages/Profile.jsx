import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Profile = () => {
    const [name, setName] = useState("Pedro Duarte");
    const [username, setUsername] = useState("@peduarte");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleSaveprofile = (e) => {
        e.preventDefault();

        console.log("profile saved:", {
            name,
            username,
        });
    };

    const handleSavePassword = (e) => {
        e.preventDefault();

        console.log("Password change requested");

        setCurrentPassword("");
        setNewPassword("");
    };

    return (
        <div className="min-h-screen pt-22 bg-gray-100">

            <Tabs defaultValue="profile" className="max-w-10xl mx-auto items-center">

                {/* =========================
            TAB NAVIGATION
        ========================== */}
                <div className="w-full px-6">
                    <TabsList className="flex h-14 items-center border-grey-100 mx-auto gap-1 rounded-none bg-transparent p-0">

                        <TabsTrigger
                            value="profile"
                            className="
                h-14 rounded-none border-b-2 border-transparent
                px-4 text-sm font-medium
                text-gray-600 border-grey-100
                hover:text-gray-900
                data-[state=active]:border-pink-600
                data-[state=active]:text-gray-900
              "
                        >
                            Profile
                        </TabsTrigger>

                        <TabsTrigger
                            value="orders"
                            className="
                h-14 rounded-none border-b-2 border-transparent
                px-4 text-sm font-medium
                text-gray-600 border-grey-100
                hover:text-gray-900
                data-[state=active]:border-pink-600
                data-[state=active]:text-gray-900
              "
                        >
                            Orders
                        </TabsTrigger>

                    </TabsList>
                </div>

                {/* =========================
            profile
        ========================== */}
                <TabsContent value="profile">
                    <div className=" mt-10 w-full text-left items-left">

                        {/* Page heading */}
                        <div className="text-center mb-10">
                            <h1 className="font-bold text-3xl text-gray-800">
                                Update Profile
                            </h1>
                        </div>

                        {/* Main profile section */}
                        <div className="w-full max-w-5xl mx-auto px-6">

                            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-14 items-start">

                                {/* ================= PROFILE PICTURE ================= */}
                                <div className="flex flex-col items-center pt-2">

                                    <img
                                        src="/ORYN-web.png"
                                        alt="profile"
                                        className="w-40 h-40 rounded-full object-cover border-4 border-pink-800"
                                    />

                                    <label className="mt-5 cursor-pointer bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition">
                                        Change Picture

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>

                                </div>


                                {/* ================= PROFILE FORM ================= */}
                                <form className="w-full space-y-5">

                                    {/* First + Last Name */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                        <div>
                                            <Label className="block text-sm font-medium mb-2">
                                                First Name
                                            </Label>

                                            <Input
                                                type="text"
                                                name="name"
                                                placeholder="Enter your First Name"
                                                className="w-full h-11"
                                            />
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium mb-2">
                                                Last Name
                                            </Label>

                                            <Input
                                                type="text"
                                                name="lastName"
                                                placeholder="Enter your Last Name"
                                                className="w-full h-11"
                                            />
                                        </div>

                                    </div>


                                    {/* Email */}
                                    <div>
                                        <Label className="block text-sm font-medium mb-2">
                                            Email
                                        </Label>

                                        <Input
                                            type="email"
                                            name="email"
                                            disabled
                                            className="w-full h-11 bg-gray-100 cursor-not-allowed"
                                        />
                                    </div>


                                    {/* Phone */}
                                    <div>
                                        <Label className="block text-sm font-medium mb-2">
                                            Phone Number
                                        </Label>

                                        <Input
                                            type="text"
                                            name="phoneNo"
                                            placeholder="Enter your Contact No"
                                            className="w-full h-11"
                                        />
                                    </div>


                                    {/* Address */}
                                    <div>
                                        <Label className="block text-sm font-medium mb-2">
                                            Address
                                        </Label>

                                        <Input
                                            type="text"
                                            name="address"
                                            placeholder="Enter your Address"
                                            className="w-full h-11"
                                        />
                                    </div>


                                    {/* City + Zip */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                        <div>
                                            <Label className="block text-sm font-medium mb-2">
                                                City
                                            </Label>

                                            <Input
                                                type="text"
                                                name="city"
                                                placeholder="Enter your City"
                                                className="w-full h-11"
                                            />
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium mb-2">
                                                Zip Code
                                            </Label>

                                            <Input
                                                type="text"
                                                name="zipCode"
                                                placeholder="Enter your ZipCode"
                                                className="w-full h-11"
                                            />
                                        </div>

                                    </div>


                                    {/* Update button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-11 mt-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                                    >
                                        Update Profile
                                    </Button>
                                    <br/>
                                    <br/>

                                </form>

                            </div>
                        </div>

                    </div>
                </TabsContent>

                {/* =========================
            ORDERS
        ========================== */}
                <TabsContent
                    value="orders"
                    className="m-0 p-6"
                >
                    <div className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm">

                        <h2 className="text-xl font-semibold text-gray-900">
                            Password
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Change your password here. After saving, you'll be logged out.
                        </p>

                        <form
                            onSubmit={handleSavePassword}
                            className="mt-8 space-y-6"
                        >

                            {/* CURRENT PASSWORD */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="currentPassword"
                                    className="text-sm font-medium text-gray-900"
                                >
                                    Current password
                                </label>

                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    className="
                    w-full rounded-md border border-gray-200
                    bg-white px-3 py-3 text-sm
                    outline-none
                    focus:border-pink-500
                    focus:ring-2 focus:ring-pink-100
                  "
                                />
                            </div>

                            {/* NEW PASSWORD */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="newPassword"
                                    className="text-sm font-medium text-gray-900"
                                >
                                    New password
                                </label>

                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="
                    w-full rounded-md border border-gray-200
                    bg-white px-3 py-3 text-sm
                    outline-none
                    focus:border-pink-500
                    focus:ring-2 focus:ring-pink-100
                  "
                                />
                            </div>

                            <button
                                type="submit"
                                className="
                  rounded-md bg-gray-900
                  px-5 py-3
                  text-sm font-medium text-white
                  transition hover:bg-gray-800
                "
                            >
                                Save password
                            </button>

                        </form>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
};

export default Profile;