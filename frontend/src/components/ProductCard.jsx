import React from 'react'
import.meta.env.VITE_API_URL;
import { Button } from './ui/button'
import { ShoppingCart } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setCart } from '@/redux/productSlice'
import axios from 'axios'

const ProductCard = ({ product, loading }) => {
    const { productImg, productPrice, productName } = product
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const addToCart = async (productId) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            navigate("/signup");
            return;
        }

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/cart/add`,
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            if (res.data.success) {
                toast.success("Product added successfully.")
                dispatch(setCart(res.data.cart))
            }

        } catch (error) {
            console.error("ADD TO CART ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to add product to cart."
            );
        }
    }

    return (
        <article className='group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300'>

            {/* Product image */}
            <div
                className='relative m-2.5 aspect-[4/3] overflow-hidden rounded-xl bg-slate-50 cursor-pointer'
                onClick={() => navigate(`/products/${product._id}`)}
            >
                {loading ? (
                    <Skeleton className='w-full h-full rounded-xl' />
                ) : (
                    <img
                        src={productImg[0]?.url}
                        alt={productName}
                        className='w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105'
                    />
                )}
            </div>

            {loading ? (
                <div className='px-3 pb-4 space-y-2'>
                    <Skeleton className='w-full h-4' />
                    <Skeleton className='w-2/3 h-4' />
                    <Skeleton className='w-1/2 h-4' />
                </div>
            ) : (
                <div className='flex flex-col flex-1 px-3 pb-3 pt-1'>
                    <h1
                        className='font-semibold text-sm sm:text-[15px] leading-5 min-h-10 line-clamp-2 cursor-pointer hover:text-pink-600 transition-colors'
                        onClick={() => navigate(`/products/${product._id}`)}
                    >
                        {productName}
                    </h1>

                    <h2 className='font-bold text-base sm:text-lg text-slate-900 mt-2 mb-3'>
                        ₹ {productPrice}
                    </h2>

                    <Button
                        onClick={() => addToCart(product._id)}
                        className='mt-auto w-full h-10 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold'
                    >
                        <ShoppingCart size={17} />
                        Add to Cart
                    </Button>
                </div>
            )}
        </article>
    )
}

export default ProductCard
