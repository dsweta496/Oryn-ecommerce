import React from "react";
import { MailCheck } from "lucide-react";

const Verify = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-600 via-fuchsia-700 to-purple-950 flex items-center justify-center px-4">

            {/* Background glow */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />

            {/* Verification Card */}
            <div className="relative z-10 w-full max-w-md">

                {/* Brand */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">
                        ORYN
                    </h1>
                    <p className="mt-1 text-sm text-white/70">
                        Your shopping destination
                    </p>
                </div>

                <div className="rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl px-8 py-10 sm:px-10 text-center">

                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                        <MailCheck
                            size={42}
                            strokeWidth={1.8}
                            className="text-pink-600"
                        />
                    </div>

                    {/* Small heading */}
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-600">
                        Almost there
                    </p>

                    {/* Main heading */}
                    <h2 className="text-3xl font-bold text-slate-900">
                        Verify your email
                    </h2>

                    {/* Description */}
                    <p className="mt-4 text-sm leading-6 text-slate-500">
                        We've sent you a verification link to your email
                        address. Please check your inbox and click the link
                        to continue.
                    </p>

                    {/* Divider */}
                    <div className="my-7 h-px bg-slate-200" />

                    {/* Help text */}
                    <p className="text-xs text-slate-400">
                        Didn't receive the email?{" "}
                        <span className="font-semibold text-pink-600">
                            Check your spam folder.
                        </span>
                    </p>

                </div>

                {/* Bottom branding */}
                <p className="mt-6 text-center text-xs text-white/50">
                    © 2026 ORYN · Shop smarter.
                </p>

            </div>
        </div>
    );
};

export default Verify;