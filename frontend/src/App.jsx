import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import Footer from "./components/footer";
import Navbar from "../src/components/navbar"
import Verify from "./pages/Verify"
import VerifyEmail from "./pages/VerifyEmail"
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import ProductDetails from "./pages/ProductDetails";
import ForgotPassword from "./pages/ForgotPassword";


const router = createBrowserRouter([
  {
    path: '/',
    element: <><Navbar /><Home /><Footer /></>
  },
  {
    path: '/signup',
    element: <><SignUp /></>
  },
  {
    path: '/login',
    element: <><LogIn /></>
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/verify',
    element: <><Verify /></>
  },
  {
    path: '/verify/:token',
    element: <><VerifyEmail /></>
  },
  {
    path: '/profile/:userId',
    element: <><Navbar /><Profile /><Footer /></>
  },
  {
    path: '/products',
    element: <><Navbar /><Products /><Footer /></>
  },
  {
    path: '/products/:productId',
    element: <><Navbar /><ProductDetails /><Footer /></>
  },
  {
    path: "/admin",
    element: <><Navbar /><Admin /><Footer /></>,
  },
  {
    path: '/cart',
    element: <><Navbar /><Cart /><Footer /></>
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App