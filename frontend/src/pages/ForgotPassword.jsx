import React, { useState } from "react";
import.meta.env.VITE_API_URL;
import {
    Eye,
    EyeOff,
    Loader2,
    Mail,
    ShieldCheck,
    LockKeyhole,
    CheckCircle2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [resetPasswordToken, setResetPasswordToken] = useState("");

    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const sendOTP = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/forgotPassword`,
                { email }
            );

            if (res.data.success) {
                setStep(2);
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to send OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("Please enter the 6-digit OTP.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/verify-otp/${encodeURIComponent(email)}`,
                { otp }
            );

            if (res.data.success) {
                setResetPasswordToken(
                    res.data.resetPasswordToken
                );

                setStep(3);

                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to verify OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    const changePassword = async (e) => {
        e.preventDefault();

        if (
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {
            toast.error(
                "Please enter and confirm your new password."
            );
            return;
        }

        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/changePassword/${encodeURIComponent(email)}`,
                {
                    newPassword: passwords.newPassword,
                    confirmPassword:
                        passwords.confirmPassword,
                    resetPasswordToken
                }
            );

            if (res.data.success) {
                setStep(4);

                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;

        setPasswords((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const renderIcon = () => {
        if (step === 1) {
            return (
                <Mail className="h-9 w-9 text-pink-600" />
            );
        }

        if (step === 2) {
            return (
                <ShieldCheck className="h-9 w-9 text-pink-600" />
            );
        }

        if (step === 3) {
            return (
                <LockKeyhole className="h-9 w-9 text-pink-600" />
            );
        }

        return (
            <CheckCircle2 className="h-10 w-10 text-green-600" />
        );
    };

    return (
        <div
            className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat px-4"
            style={{
                backgroundImage: "url('/login-bg.jpg')"
            }}
        >
            <div className="absolute inset-0 bg-black/55"></div>

            <div className="absolute w-[500px] h-[500px] bg-pink-600/20 blur-3xl rounded-full"></div>

            <Card className="relative z-10 w-full max-w-sm bg-white/90 backdrop-blur-md border-white/30 shadow-2xl">

                <CardHeader className="text-center">

                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
                        {renderIcon()}
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
                        ORYN Account Recovery
                    </p>

                    <CardTitle className="text-2xl mt-1">

                        {step === 1 &&
                            "Forgot your password?"}

                        {step === 2 &&
                            "Verify your email"}

                        {step === 3 &&
                            "Create a new password"}

                        {step === 4 &&
                            "Password changed"}

                    </CardTitle>

                    <CardDescription>

                        {step === 1 &&
                            "Enter the email associated with your ORYN account."}

                        {step === 2 &&
                            `We've sent a 6-digit OTP to ${email}.`}

                        {step === 3 &&
                            "Choose a new password for your ORYN account."}

                        {step === 4 &&
                            "Your password has been changed successfully."}

                    </CardDescription>

                </CardHeader>

                <CardContent>

                    {/* STEP 1 — EMAIL */}

                    {step === 1 && (
                        <form
                            onSubmit={sendOTP}
                            className="grid gap-4"
                        >

                            <div className="grid gap-2">

                                <Label htmlFor="forgot-email">
                                    Email
                                </Label>

                                <Input
                                    id="forgot-email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    className="bg-white/80"
                                />

                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500"
                            >

                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Sending OTP
                                    </>
                                ) : (
                                    "Send OTP"
                                )}

                            </Button>

                        </form>
                    )}

                    {/* STEP 2 — OTP */}

                    {step === 2 && (
                        <form
                            onSubmit={verifyOTP}
                            className="grid gap-4"
                        >

                            <div className="grid gap-2">

                                <Label htmlFor="otp">
                                    6-digit OTP
                                </Label>

                                <Input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    placeholder="Enter OTP"
                                    required
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    className="bg-white/80 tracking-[0.35em] text-center"
                                />

                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500"
                            >

                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Verifying
                                    </>
                                ) : (
                                    "Verify OTP"
                                )}

                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-pink-800 hover:underline cursor-pointer"
                            >
                                Change email
                            </button>

                        </form>
                    )}

                    {/* STEP 3 — NEW PASSWORD */}

                    {step === 3 && (
                        <form
                            onSubmit={changePassword}
                            className="grid gap-4"
                        >

                            <div className="grid gap-2">

                                <Label htmlFor="newPassword">
                                    New Password
                                </Label>

                                <div className="relative">

                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter new password"
                                        required
                                        value={
                                            passwords.newPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        className="bg-white/80 pr-12"
                                    />

                                    {showPassword ? (
                                        <EyeOff
                                            onClick={() =>
                                                setShowPassword(false)
                                            }
                                            className="w-5 h-5 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                        />
                                    ) : (
                                        <Eye
                                            onClick={() =>
                                                setShowPassword(true)
                                            }
                                            className="w-5 h-5 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                        />
                                    )}

                                </div>

                            </div>

                            <div className="grid gap-2">

                                <Label htmlFor="confirmPassword">
                                    Confirm Password
                                </Label>

                                <div className="relative">

                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm new password"
                                        required
                                        value={
                                            passwords.confirmPassword
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        className="bg-white/80 pr-12"
                                    />

                                    {showConfirmPassword ? (
                                        <EyeOff
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    false
                                                )
                                            }
                                            className="w-5 h-5 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                        />
                                    ) : (
                                        <Eye
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    true
                                                )
                                            }
                                            className="w-5 h-5 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                        />
                                    )}

                                </div>

                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500"
                            >

                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        Changing password
                                    </>
                                ) : (
                                    "Change Password"
                                )}

                            </Button>

                        </form>
                    )}

                    {/* STEP 4 — SUCCESS */}

                    {step === 4 && (
                        <div className="text-center">

                            <p className="text-gray-600">
                                You can now log in using your
                                new password.
                            </p>

                            <Button
                                type="button"
                                onClick={() =>
                                    navigate("/login")
                                }
                                className="w-full mt-5 cursor-pointer bg-pink-600 hover:bg-pink-500"
                            >
                                Back to Login
                            </Button>

                        </div>
                    )}

                </CardContent>

                {step !== 4 && (
                    <CardFooter className="justify-center">

                        <p className="text-gray-700 text-sm">

                            Remembered your password?{" "}

                            <Link
                                to="/login"
                                className="hover:underline cursor-pointer text-pink-800"
                            >
                                Back to Login
                            </Link>

                        </p>

                    </CardFooter>
                )}

            </Card>
        </div>
    );
};

export default ForgotPassword;