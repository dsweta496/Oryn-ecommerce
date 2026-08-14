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


const router = createBrowserRouter([
  {
    path:'/',
    element: <><Navbar/><Home/><Footer/></>
  },
  {
    path:'/signup',
    element: <><SignUp/></>
  },
  {
    path:'/login',
    element: <><LogIn/></>
  },
  {
    path:'/verify',
    element: <><Verify/></>
  },
  {
    path:'/verify/:token',
    element: <><VerifyEmail/></>
  },
  {
    path:'/profile',
    element: <><Navbar/><Profile/><Footer/></>
  }
])

function App() {
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App