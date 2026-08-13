import { Button } from "@/components/ui/button";
import react from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import Navbar from "./components/ui/navbar";
import Verify from "./pages/Verify"
import VerifyEmail from "./pages/VerifyEmail"


const router = createBrowserRouter([
  {
    path:'/',
    element: <><Navbar/><Home/></>
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