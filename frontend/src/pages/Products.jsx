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
import ProductCard from '@/components/ProductCard'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/productSlice.js'

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
    const dispatch = useDispatch();


    const getAllProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8000/api/v1/product/getAllProducts');
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
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
        }

        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category)
        }
        if (Brand !== "All") {
            filtered = filtered.filter(p => p.brand === Brand)
        }

        filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

        if (sortOrder === "lowtohigh") {
            filtered.sort((a, b) => a.productPrice - b.productPrice)
        } else if (sortOrder === "hightolow") {
            filtered.sort((a, b) => b.productPrice - a.productPrice)
        }
        dispatch(setProducts(filtered))

    }, [search, category, Brand, sortOrder, priceRange, allProducts, dispatch])

    useEffect(() => {
        getAllProducts();
    }, [])


    return (
        <div className='pb-10'>
            <div className='max-w-7xl mx-auto flex gap-7'>
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
                />
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-end mb-4'>
                        <Select items={items} onValueChange={(value)=>setSortOrder(value)}>
                            <SelectTrigger className="w-full max-w-[200px]">
                                <SelectValue placeholder="Select by Price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Price:</SelectLabel>
                                    {items.map((item) => (
                                        <SelectItem key={item.value} value={item.value}>
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {/*product grid*/}
                    <div className='grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7'>
                        {
                            products.map((product) => {
                                return (<ProductCard
                                    key={product._id}
                                    product={product}
                                    loading={loading}
                                />)
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products;