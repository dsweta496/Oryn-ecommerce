import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import.meta.env.VITE_API_URL;
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import { ShoppingBag } from "lucide-react";

const Profile = () => {
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();

    const initialTab =
        searchParams.get("tab") === "orders"
            ? "orders"
            : "profile";

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

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

    const fetchMyOrders = async () => {
        try {
            setOrdersLoading(true);

            const accessToken = localStorage.getItem("accessToken");

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/order/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.data.success) {
                setOrders(res.data.orders || []);
            }
        } catch (error) {
            console.error("FETCH ORDERS ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch your orders."
            );
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchMyOrders();
        }
    }, [user?._id]);

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
                `${import.meta.env.VITE_API_URL}/api/v1/user/update/${user?._id}`,
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

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        if (newPassword === currentPassword) {
            toast.error(
                "New password must be different from your current password."
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const accessToken = localStorage.getItem("accessToken");

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/changePassword`,
                {
                    currentPassword,
                    newPassword,
                    confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }

        } catch (error) {
            console.error("CHANGE PASSWORD ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-22 bg-gray-100">

            <Tabs
                defaultValue={initialTab}
                className="max-w-10xl mx-auto items-center"
            >

                {/* TAB NAVIGATION */}
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

                        <TabsTrigger
                            value="password"
                            className="
                                h-14 rounded-none border-b-2 border-transparent
                                px-4 text-sm font-medium
                                text-gray-600 border-grey-100
                                hover:text-gray-900
                                data-[state=active]:border-pink-600
                                data-[state=active]:text-gray-900
                            "
                        >
                            Password
                        </TabsTrigger>

                    </TabsList>

                </div>

                {/* PROFILE */}
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

                                {/* PROFILE PICTURE */}
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

                                {/* PROFILE FORM */}
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

                {/* ORDERS */}
                <TabsContent value="orders">

                    <div className="w-full max-w-5xl mx-auto px-6 py-10">

                        <div className="mb-8">

                            <h1 className="font-bold text-3xl text-gray-800">
                                My Orders
                            </h1>

                            <p className="text-gray-500 mt-2">
                                View and track all your orders.
                            </p>

                        </div>

                        {/* LOADING */}
                        {ordersLoading && (

                            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

                                <p className="text-gray-500">
                                    Loading your orders...
                                </p>

                            </div>

                        )}

                        {/* NO ORDERS */}
                        {!ordersLoading && orders.length === 0 && (

                            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">

                                <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />

                                <h2 className="text-lg font-semibold text-gray-800">
                                    No orders yet
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Your orders will appear here once you place one.
                                </p>

                            </div>

                        )}

                        {/* ORDERS */}
                        {!ordersLoading && orders.length > 0 && (

                            <div className="space-y-5">

                                {orders.map((order) => (

                                    <div
                                        key={order._id}
                                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                                    >

                                        {/* ORDER HEADER */}
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-4">

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Order ID
                                                </p>

                                                <p className="font-semibold text-gray-800 break-all">
                                                    #{order._id}
                                                </p>

                                            </div>

                                            <div className="flex gap-2">

                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    {order.orderStatus}
                                                </span>

                                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                    {order.paymentStatus}
                                                </span>

                                            </div>

                                        </div>

                                        {/* PRODUCTS */}
                                        <div className="py-5">

                                            <p className="text-sm text-gray-500 mb-3">
                                                Products
                                            </p>

                                            <div className="space-y-3">

                                                {order.items?.map((item, index) => (

                                                    <div
                                                        key={item._id || index}
                                                        className="flex items-center justify-between gap-4"
                                                    >

                                                        <div className="min-w-0">

                                                            <p className="font-medium text-gray-800">
                                                                {item.productName || "Product"}
                                                            </p>

                                                            <p className="text-sm text-gray-500">
                                                                Quantity: {item.quantity}
                                                            </p>

                                                        </div>

                                                        <p className="font-semibold text-gray-800 whitespace-nowrap">
                                                            ₹{(
                                                                (item.price || 0) *
                                                                (item.quantity || 0)
                                                            ).toLocaleString("en-IN")}
                                                        </p>

                                                    </div>

                                                ))}

                                            </div>

                                        </div>

                                        {/* FOOTER */}
                                        <div className="border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                                            <div>

                                                <p className="text-sm text-gray-500">
                                                    Payment
                                                </p>

                                                <p className="font-medium text-gray-800 uppercase">
                                                    {order.paymentMethod}
                                                </p>

                                            </div>

                                            <div className="text-left md:text-right">

                                                <p className="text-sm text-gray-500">
                                                    Total
                                                </p>

                                                <p className="text-xl font-bold text-gray-900">
                                                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </TabsContent>

                {/* PASSWORD */}
                <TabsContent value="password">

                    <div className="w-full max-w-2xl mx-auto px-6 py-10">

                        <div className="mb-8">

                            <h1 className="font-bold text-3xl text-gray-800">
                                Change Password
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Update your password securely from your account.
                            </p>

                        </div>

                        <form
                            onSubmit={handlePasswordChange}
                            className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6"
                        >

                            {/* Current Password */}
                            <div>

                                <Label className="block text-sm font-medium mb-2">
                                    Current Password
                                </Label>

                                <Input
                                    type="password"
                                    placeholder="Enter your current password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    className="w-full h-11"
                                    autoComplete="current-password"
                                />

                            </div>

                            {/* New Password */}
                            <div>

                                <Label className="block text-sm font-medium mb-2">
                                    New Password
                                </Label>

                                <Input
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="w-full h-11"
                                    autoComplete="new-password"
                                />

                            </div>

                            {/* Confirm Password */}
                            <div>

                                <Label className="block text-sm font-medium mb-2">
                                    Confirm New Password
                                </Label>

                                <Input
                                    type="password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="w-full h-11"
                                    autoComplete="new-password"
                                />

                            </div>

                            <Button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                            >
                                {passwordLoading
                                    ? "Updating password..."
                                    : "Save Password"}
                            </Button>

                        </form>

                    </div>

                </TabsContent>

            </Tabs>

        </div>
    );
};

export default Profile;