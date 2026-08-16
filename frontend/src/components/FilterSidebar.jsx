import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
    Search,
    RotateCcw,
    SlidersHorizontal,
    X,
    ChevronDown
} from 'lucide-react'

const FilterSidebar = ({
    allProducts,
    priceRange,
    search,
    setSearch,
    category,
    setCategory,
    Brand,
    setBrand,
    setPriceRange,
    mobileOpen = false,
    setMobileOpen = () => {}
}) => {
    const Categories = allProducts.map(p => p.category)
    const UniqueCategory = ["All", ...new Set(Categories)]

    const Brands = allProducts.map(p => p.brand)
    const UniqueBrand = ["All", ...new Set(Brands)]

    const handleCategoryClick = (value) => {
        setCategory(value)
    }

    const handleBrandChange = (e) => {
        setBrand(e.target.value)
    }

    const handleMinChange = (e) => {
        const value = Number(e.target.value)
        if (value <= priceRange[1]) {
            setPriceRange([value, priceRange[1]])
        }
    }

    const handleMaxChange = (e) => {
        const value = Number(e.target.value)
        if (value >= priceRange[0]) {
            setPriceRange([priceRange[0], value])
        }
    }

    const resetFilters = () => {
        setSearch("")
        setCategory("All")
        setBrand("All")
        setPriceRange([0, 999999])
    }

    const filterContent = (
        <div className='flex flex-col min-h-full'>

            {/* Header */}
            <div className='flex items-center justify-between mb-5'>
                <div>
                    <div className='flex items-center gap-2'>
                        <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-pink-600'>
                            <SlidersHorizontal size={18} />
                        </div>
                        <div>
                            <h2 className='text-lg font-bold text-slate-900'>Filters</h2>
                            <p className='text-xs text-slate-500'>Refine your search</p>
                        </div>
                    </div>
                </div>

                <button
                    type='button'
                    onClick={() => setMobileOpen(false)}
                    className='md:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    aria-label='Close filters'
                >
                    <X size={20} />
                </button>
            </div>

            {/* Search */}
            <div className='mb-6'>
                <label className='block text-sm font-semibold text-slate-800 mb-2'>
                    Search products
                </label>

                <div className='relative'>
                    <Search
                        size={17}
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
                    />

                    <Input
                        type='text'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='Search by product name...'
                        className='h-11 bg-white pl-10 pr-3 rounded-xl border-slate-200 shadow-sm focus-visible:ring-pink-500'
                    />
                </div>
            </div>

            <div className='h-px bg-slate-100 mb-6' />

            {/* Category */}
            <div className='mb-6'>
                <h3 className='text-sm font-bold text-slate-900 mb-3'>Category</h3>

                <div className='space-y-1.5'>
                    {UniqueCategory.map((item, index) => {
                        const selected = category === item

                        return (
                            <button
                                type='button'
                                key={index}
                                onClick={() => handleCategoryClick(item)}
                                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                                    selected
                                        ? 'bg-pink-50 text-pink-700 font-semibold'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                            >
                                <span className='flex items-center gap-3'>
                                    <span
                                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                            selected
                                                ? 'border-pink-600'
                                                : 'border-slate-300'
                                        }`}
                                    >
                                        {selected && (
                                            <span className='h-2 w-2 rounded-full bg-pink-600' />
                                        )}
                                    </span>

                                    <span>{item}</span>
                                </span>

                                {selected && (
                                    <span className='text-xs text-pink-600'>✓</span>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Brand */}
            <div className='mb-6'>
                <h3 className='text-sm font-bold text-slate-900 mb-3'>Brand</h3>

                <div className='relative'>
                    <select
                        value={Brand}
                        onChange={handleBrandChange}
                        className='appearance-none bg-white w-full h-11 pl-3 pr-10 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition'
                    >
                        {UniqueBrand.map((item, index) => (
                            <option key={index} value={item}>
                                {item.toUpperCase()}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={17}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'
                    />
                </div>
            </div>

            {/* Price */}
            <div className='mb-6'>
                <div className='flex items-center justify-between mb-3'>
                    <h3 className='text-sm font-bold text-slate-900'>Price range</h3>
                    <span className='text-xs text-slate-400'>₹0 - ₹9,99,999</span>
                </div>

                <div className='grid grid-cols-2 gap-2 mb-4'>
                    <div>
                        <label className='block text-[11px] font-medium text-slate-400 mb-1'>
                            Minimum
                        </label>
                        <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>
                                ₹
                            </span>
                            <input
                                type='number'
                                min='0'
                                max='5000'
                                value={priceRange[0]}
                                onChange={handleMinChange}
                                className='w-full h-10 pl-7 pr-2 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-[11px] font-medium text-slate-400 mb-1'>
                            Maximum
                        </label>
                        <div className='relative'>
                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'>
                                ₹
                            </span>
                            <input
                                type='number'
                                min='5000'
                                max='999999'
                                value={priceRange[1]}
                                onChange={handleMaxChange}
                                className='w-full h-10 pl-7 pr-2 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100'
                            />
                        </div>
                    </div>
                </div>

                <div className='space-y-1'>
                    <input
                        type='range'
                        min='0'
                        max='5000'
                        step='100'
                        className='w-full accent-pink-600 cursor-pointer'
                        value={priceRange[0]}
                        onChange={handleMinChange}
                    />

                    <input
                        type='range'
                        min='5000'
                        max='999999'
                        step='100'
                        className='w-full accent-pink-600 cursor-pointer'
                        value={priceRange[1]}
                        onChange={handleMaxChange}
                    />
                </div>
            </div>

            <div className='mt-auto pt-3'>
                <Button
                    onClick={resetFilters}
                    className='w-full h-11 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold shadow-sm'
                >
                    <RotateCcw size={16} />
                    Reset Filters
                </Button>
            </div>
        </div>
    )

    return (
        <>
            {/* Desktop sidebar */}
            <aside className='hidden md:block w-64 lg:w-72 shrink-0'>
                <div className='sticky top-24 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
                    {filterContent}
                </div>
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className='md:hidden fixed inset-0 z-[70]'>
                    <button
                        type='button'
                        aria-label='Close filters'
                        onClick={() => setMobileOpen(false)}
                        className='absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]'
                    />

                    <aside className='absolute left-0 top-0 bottom-0 w-[86%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl'>
                        {filterContent}
                    </aside>
                </div>
            )}
        </>
    )
}

export default FilterSidebar
