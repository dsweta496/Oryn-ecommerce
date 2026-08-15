import { useEffect, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";

const Profile = () => {
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const [name, setName] = useState("Pedro Duarte");
    const [username, setUsername] = useState("@peduarte");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [updateUser, setUpdateUser] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        address: user?.address || "",
        city: user?.city || "",
        zipCode: user?.zipCode || "",
        profilePic: user?.profilePic || "",
        role: user?.role || ""
    });

    // Keep the form synchronized with the Redux user
    useEffect(() => {
        if (user) {
            setUpdateUser({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phoneNo: user.phoneNo || "",
                address: user.address || "",
                city: user.city || "",
                zipCode: user.zipCode || "",
                profilePic: user.profilePic || "",
                role: user.role || ""
            });
        }
    }, [user]);

    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setUpdateUser({
            ...updateUser,
            [e.target.name]: e.target.value
        });
    };

    // Profile picture functionality preserved
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);

        setUpdateUser({
            ...updateUser,
            profilePic: URL.createObjectURL(selectedFile)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken");

        if (!user?._id) {
            toast.error("User information not found.");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("firstName", updateUser.firstName);
            formData.append("lastName", updateUser.lastName);
            formData.append("phoneNo", updateUser.phoneNo);
            formData.append("address", updateUser.address);
            formData.append("city", updateUser.city);
            formData.append("zipCode", updateUser.zipCode);

            // Keep the original file field name
            if (file) {
                formData.append("file", file);
            }

            const res = await axios.put(
                `http://localhost:8000/api/v1/user/update/${user?._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log("UPDATE PROFILE ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        }
    };

    return (
        <div className="min-h-screen pt-22 bg-gray-100">

            <Tabs
                defaultValue="profile"
                className="max-w-10xl mx-auto items-center"
            >

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
                    PROFILE
                ========================== */}
                <TabsContent value="profile">

                    <div className="mt-10 w-full text-left items-left">

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
                                        src={
                                            updateUser.profilePic ||
                                            "/ORYN-web.png"
                                        }
                                        alt="profile"
                                        className="w-40 h-40 rounded-full object-cover border-4 border-pink-800"
                                    />

                                    <label className="mt-5 cursor-pointer bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition">
                                        Change Picture

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>

                                </div>

                                {/* ================= PROFILE FORM ================= */}
                                <form
                                    className="w-full space-y-5"
                                    onSubmit={handleSubmit}
                                >

                                    {/* First + Last Name */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                        <div>
                                            <Label className="block text-sm font-medium mb-2">
                                                First Name
                                            </Label>

                                            <Input
                                                type="text"
                                                name="firstName"
                                                placeholder="Enter your First Name"
                                                value={updateUser.firstName}
                                                onChange={handleChange}
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
                                                value={updateUser.lastName}
                                                onChange={handleChange}
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
                                            value={updateUser.email}
                                            onChange={handleChange}
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
                                            value={updateUser.phoneNo}
                                            onChange={handleChange}
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
                                            value={updateUser.address}
                                            onChange={handleChange}
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
                                                value={updateUser.city}
                                                onChange={handleChange}
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
                                                placeholder="Enter your zipCode"
                                                value={updateUser.zipCode}
                                                onChange={handleChange}
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

                                    <br />
                                    <br />

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
                            Change your password here. After saving, you'll be
                            logged out.
                        </p>

                        <form className="mt-8 space-y-6">

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