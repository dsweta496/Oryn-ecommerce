import React, { useEffect, useState } from 'react'
import FilterSidebar from "@/components/FilterSidebar"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import.meta.env.VITE_API_URL;
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice.js'
import { SlidersHorizontal } from 'lucide-react'

const Products = () => {
    const { products } = useSelector(store => store.product)

    const items = [
        { label: "Low to High", value: "lowtohigh" },
        { label: "High to Low", value: "hightolow" },
        { label: "Select by Price", value: null },
    ]

    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [Brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999]);
    const [sortOrder, setSortOrder] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(
        window.innerWidth < 768 ? 10 : 15
    )
    const dispatch = useDispatch();

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/product/getAllProducts`);

            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = [...allProducts]

        if (search.trim() !== "") {
            filtered = filtered.filter(p =>
                p.productName?.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category)
        }

        if (Brand !== "All") {
            filtered = filtered.filter(p => p.brand === Brand)
        }

        filtered = filtered.filter(
            p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
        )

        if (sortOrder === "lowtohigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sortOrder === "hightolow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }
        setCurrentPage(1)

        dispatch(setProducts(filtered))
    }, [search, category, Brand, sortOrder, priceRange, allProducts, dispatch])

    const totalPages = Math.ceil(products.length / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const currentProducts = products.slice(
        startIndex,
        startIndex + itemsPerPage
    )

    useEffect(() => {
        getAllProducts();
    }, [])
    useEffect(() => {
        const handleResize = () => {
            setItemsPerPage(window.innerWidth < 768 ? 10 : 15)
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    return (
        <div className='bg-slate-50 min-h-screen pb-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5'>

                {/* Mobile filter control */}
                <div className='md:hidden flex items-center justify-between gap-3 mb-5'>
                    <button
                        type='button'
                        onClick={() => setShowFilters(true)}
                        className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-800 shadow-sm hover:border-pink-300 hover:text-pink-600 transition-colors'
                    >
                        <SlidersHorizontal size={18} />
                        Filters
                    </button>

                    <Select items={items} onValueChange={(value) => setSortOrder(value)}>
                        <SelectTrigger className='w-[180px] bg-white border-gray-200 rounded-xl'>
                            <SelectValue placeholder="Select by Price" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Price:</SelectLabel>
                                {items.map((item) => (
                                    <SelectItem
                                        key={item.value ?? "default"}
                                        value={item.value ?? "default"}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className='flex items-start gap-6 lg:gap-8'>

                    <FilterSidebar
                        search={search}
                        setSearch={setSearch}
                        Brand={Brand}
                        setBrand={setBrand}
                        category={category}
                        setCategory={setCategory}
                        allProducts={allProducts}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        mobileOpen={showFilters}
                        setMobileOpen={setShowFilters}
                    />

                    <div className='min-w-0 flex-1'>

                        {/* Desktop sort */}
                        <div className='hidden md:flex justify-end mb-5'>
                            <Select items={items} onValueChange={(value) => setSortOrder(value)}>
                                <SelectTrigger className="w-full max-w-[210px] bg-white border-gray-200 rounded-xl shadow-sm">
                                    <SelectValue placeholder="Select by Price" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Price:</SelectLabel>
                                        {items.map((item) => (
                                            <SelectItem
                                                key={item.value ?? "default"}
                                                value={item.value ?? "default"}
                                            >
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Product grid */}
                        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5'>
                            {currentProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    loading={loading}
                                />
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className='flex items-center justify-center gap-2 mt-8'>
                                <button
                                    type='button'
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className='px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-pink-400 hover:text-pink-600 transition'
                                >
                                    Previous
                                </button>

                                <div className='flex items-center gap-1'>
                                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                type='button'
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${currentPage === page
                                                        ? 'bg-pink-600 text-white shadow-sm'
                                                        : 'bg-white border border-slate-200 text-slate-700 hover:border-pink-400 hover:text-pink-600'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                </div>

                                <button
                                    type='button'
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className='px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:border-pink-400 hover:text-pink-600 transition'
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products
