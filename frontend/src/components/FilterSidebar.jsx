import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button';

const FilterSidebar = ({ allProducts, priceRange, search, setSearch, category, setCategory, Brand, setBrand, setPriceRange }) => {
    const Categories = allProducts.map(p => p.category)
    const UniqueCategory = ["All", ...new Set(Categories)];

    const Brands = allProducts.map(p => p.brand)
    const UniqueBrand = ["All", ...new Set(Brands)]
    console.log(UniqueBrand);

    const handleCategoryClick = (value) => {
        setCategory(value)
    }

    const handleBrandChange = (e) => {
        setBrand(e.target.value);
    }

    const handleMinChange = (e) => {
        const value = Number(e.target.value);
        if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
    }

    const handleMaxChange = (e) => {
        const value = Number(e.target.value);
        if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
    }

    const resetFilters = () => {
        setSearch("");
        setCategory("All");
        setBrand("All");
        setPriceRange([0, 999999])
    }

    return (
        <div className='bg-gray-100 p-4 rounded-md h-max hidden md:block w-64'>
            <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="bg-white p-2 rounded-md border-grey-400 border-2 w-full" />

            <h1 className='mt-5 font-semibold text-xl'>Category</h1>

            <div className='flex flex-col mt-3 gap-2'>
                {UniqueCategory.map((item, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <input type="radio" checked={category === item} onChange={() => handleCategoryClick(item)} />
                        <label>{item}</label>
                    </div>
                ))}
            </div>
            <h1 className='mt-5 font-semibold text-xl'>Brands</h1>
            <select className='bg-white w-full p-2 border-gray-200 border-2 rounded-md' value={Brand} onChange={handleBrandChange}>
                {
                    UniqueBrand.map((item, index) => {
                        return <option key={index} value={item}>{item.toUpperCase()}</option>
                    })
                }
            </select>

            <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range:S</h1>
            <div className='flex flex-col gap-2'>
                
                <div className='flex gap-2 item-center'>
                    ₹ <input type="number" min="0" max="5000" value={priceRange[0]} onChange={handleMinChange} className='w-20 p-1 border border-gray-300 rounded' />
                    <span>-</span>
                    ₹ <input type="number" min="5000" max="999999" value={priceRange[1]} onChange={handleMaxChange} className='w-20 p-1 border border-gray-300 rounded' />
                </div>

                <input type="range" min="0" max="5000" step="100" className='w-full' value={priceRange[0]} onChange={handleMinChange}/>
                <input type="range" min="5000" max="999999" step="100" className='w-full' value={priceRange[1]} onChange={handleMaxChange}/>
            </div>

            <Button onClick={resetFilters} className="bg-pink-600 text-white mt-5 cursor-pointer w-full">Reset Filter</Button>


        </div>
    )
}

export default FilterSidebar