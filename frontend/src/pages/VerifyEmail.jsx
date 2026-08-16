import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import.meta.env.VITE_API_URL;

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("Verifying...");
    const [email, setEmail] = useState("");
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const verifyEmail = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data) {
                setStatus("Email verified successfully!");

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            console.log("Verification error:", error);

            setStatus("Verification Failed.");
        }
    };

    const resendVerification = async () => {
        try {
            setResending(true);
            setResendMessage("");

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/reVerify`,
                { email }
            );

            setResendMessage(
                res.data.message || "Verification email sent successfully."
            );
        } catch (error) {
            console.log("Resend error:", error);

            setResendMessage(
                error.response?.data?.message ||
                "Unable to resend verification email."
            );
        } finally {
            setResending(false);
        }
    };

    useEffect(() => {
        verifyEmail();
    }, [token]);

   return (
    <div className="min-h-screen flex items-center justify-center px-5
                    bg-gradient-to-br from-[#ec008c] via-[#b0005a] to-[#3b0764]">

        <div className="absolute top-8 left-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">
                ORYN
            </h1>
        </div>

        <div className="w-full max-w-md">

            <div className="bg-white/95 backdrop-blur-xl rounded-3xl
                            px-8 py-10 sm:px-10 sm:py-12
                            shadow-2xl text-center">

                {status === "Verifying..." && (
                    <>
                        <div className="mx-auto mb-6 w-14 h-14 rounded-full
                                        border-4 border-gray-200
                                        border-t-[#ec008c] animate-spin">
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-900">
                            Verifying your email
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Please wait while we verify your account.
                        </p>
                    </>
                )}

                {status === "Email verified successfully!" && (
                    <>
                        <div className="mx-auto mb-6 flex items-center justify-center
                                        w-16 h-16 rounded-full
                                        bg-green-50 border border-green-200">

                            <span className="text-3xl text-green-600">
                                ✓
                            </span>

                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Email verified
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Your ORYN account has been successfully verified.
                        </p>

                        <p className="mt-6 text-sm text-gray-400">
                            Redirecting you to login...
                        </p>
                    </>
                )}

                {status === "Verification Failed." && (
                    <>
                        <div className="mx-auto mb-6 flex items-center justify-center
                                        w-16 h-16 rounded-full
                                        bg-red-50 border border-red-200">

                            <span className="text-2xl text-red-500">
                                !
                            </span>

                        </div>

                        <h2 className="text-2xl font-bold text-gray-900">
                            Verification failed
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Your verification link may have expired
                            or is no longer valid.
                        </p>

                        <div className="mt-7 text-left">

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl
                                           border border-gray-200
                                           focus:outline-none
                                           focus:ring-2 focus:ring-[#ec008c]/30
                                           focus:border-[#ec008c]"
                            />

                            <button
                                onClick={resendVerification}
                                disabled={resending || !email}
                                className="w-full mt-4 py-3 rounded-xl
                                           bg-[#ec008c] text-white
                                           font-semibold
                                           hover:bg-[#d6007d]
                                           transition
                                           disabled:opacity-50
                                           disabled:cursor-not-allowed"
                            >
                                {resending
                                    ? "Sending..."
                                    : "Resend verification email"}
                            </button>

                            {resendMessage && (
                                <p className="mt-4 text-sm text-center text-gray-500">
                                    {resendMessage}
                                </p>
                            )}

                        </div>
                    </>
                )}

            </div>

            <p className="text-center text-white/60 text-sm mt-6">
                © ORYN · Shop smarter.
            </p>

        </div>
    </div>
);
};

export default VerifyEmail;