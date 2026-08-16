import react, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import.meta.env.VITE_API_URL;
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log(formData);

        try {
            setLoading(true)

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/user/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

            if (res.data.success) {
                navigate('/verify')
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error)

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="relative flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat px-4"
            style={{ backgroundImage: "url('/login-bg.jpg')" }}
        >

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/55"></div>

            {/* Subtle pink glow */}
            <div className="absolute w-[500px] h-[500px] bg-pink-600/20 blur-3xl rounded-full"></div>

            {/* Signup Card */}
            <Card className="relative z-10 w-full max-w-sm bg-white/90 backdrop-blur-md border-white/30 shadow-2xl">

                <CardHeader>

                    <CardTitle className="text-2xl">
                        Create your account
                    </CardTitle>

                    <CardDescription>
                        Enter your details below to create your account
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <div className="flex flex-col gap-3">

                        {/* First Name + Last Name */}
                        <div className="grid grid-cols-2 gap-4">

                            {/* First Name */}
                            <div className="grid gap-2">

                                <Label htmlFor="firstName">
                                    First Name
                                </Label>

                                <Input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    placeholder="John"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="bg-white/80"
                                />

                            </div>

                            {/* Last Name */}
                            <div className="grid gap-2">

                                <Label htmlFor="lastName">
                                    Last Name
                                </Label>

                                <Input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    placeholder="Doe"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="bg-white/80"
                                />

                            </div>

                        </div>

                        {/* Email */}
                        <div className="grid gap-2">

                            <Label htmlFor="email">
                                Email
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="m@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-white/80"
                            />

                        </div>

                        {/* Password */}
                        <div className="grid gap-2">

                            <div className="flex items-center">
                                <Label htmlFor="password">
                                    Password
                                </Label>
                            </div>

                            <div className="relative">

                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Create a Password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="bg-white/80 pr-12"
                                />

                                {showPassword ? (
                                    <EyeOff
                                        onClick={() => setShowPassword(false)}
                                        className="w-5 h-5 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                    />
                                ) : (
                                    <Eye
                                        onClick={() => setShowPassword(true)}
                                        className="w-5 h-5 text-gray-700 absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                    />
                                )}

                            </div>

                        </div>

                    </div>

                </CardContent>

                <CardFooter className="flex-col gap-2">

                    {/* Sign Up Button */}
                    <Button
                        onClick={submitHandler}
                        type="submit"
                        className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Please wait
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>

                    {/* Login */}
                    <p className="text-gray-700 text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="hover:underline cursor-pointer text-pink-800"
                        >
                            Login
                        </Link>
                    </p>

                </CardFooter>

            </Card>

        </div>
    )
}

export default SignUp;