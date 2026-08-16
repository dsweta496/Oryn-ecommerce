import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    LayoutDashboard,
    Plus,
    Pencil,
    Trash2,
    X,
    Upload,
} from "lucide-react";

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ADD PRODUCT
    const [showAddProduct, setShowAddProduct] = useState(false);

    const [productForm, setProductForm] = useState({
        productName: "",
        productDesc: "",
        productPrice: "",
        category: "",
        brand: "",
    });

    const [productImages, setProductImages] = useState([]);
    const [addingProduct, setAddingProduct] = useState(false);

    // EDIT PRODUCT
    const [showEditProduct, setShowEditProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [editProductForm, setEditProductForm] = useState({
        productName: "",
        productDesc: "",
        productPrice: "",
        category: "",
        brand: "",
    });

    const [existingImages, setExistingImages] = useState([]);
    const [editProductImages, setEditProductImages] = useState([]);
    const [updatingProduct, setUpdatingProduct] = useState(false);

    // DELETE PRODUCT
    const [deletingProductId, setDeletingProductId] = useState(null);


    // ============================================================
    // FETCH PRODUCTS
    // ============================================================

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                "http://localhost:8000/api/v1/product/getAllProducts"
            );

            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.error(
                "Error fetching products:",
                error.response?.data?.message || error.message
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);


    // ============================================================
    // ADD PRODUCT
    // ============================================================

    const handleProductChange = (e) => {
        const { name, value } = e.target;

        setProductForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            alert("You can upload a maximum of 5 images.");
            return;
        }

        setProductImages(files);
    };


    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (productImages.length === 0) {
            alert("Please select at least one product image.");
            return;
        }

        try {
            setAddingProduct(true);

            const formData = new FormData();

            formData.append("productName", productForm.productName);
            formData.append("productDesc", productForm.productDesc);
            formData.append("productPrice", productForm.productPrice);
            formData.append("category", productForm.category);
            formData.append("brand", productForm.brand);

            productImages.forEach((image) => {
                formData.append("files", image);
            });

            const accessToken =
                localStorage.getItem("accessToken") ||
                localStorage.getItem("token");

            if (!accessToken) {
                alert("Authorization token is missing. Please login again.");
                return;
            }

            const response = await axios.post(
                "http://localhost:8000/api/v1/product/add",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data.success) {
                alert("Product added successfully!");

                setProductForm({
                    productName: "",
                    productDesc: "",
                    productPrice: "",
                    category: "",
                    brand: "",
                });

                setProductImages([]);

                setShowAddProduct(false);

                fetchProducts();
            }
        } catch (error) {
            console.error(
                "Error adding product:",
                error.response?.data?.message || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to add product. Please try again."
            );
        } finally {
            setAddingProduct(false);
        }
    };


    // ============================================================
    // EDIT PRODUCT
    // ============================================================

    const handleEditProduct = (product) => {
        setEditingProduct(product);

        setEditProductForm({
            productName: product.productName || "",
            productDesc: product.productDesc || "",
            productPrice: product.productPrice || "",
            category: product.category || "",
            brand: product.brand || "",
        });

        setExistingImages(product.productImg || []);
        setEditProductImages([]);

        setShowEditProduct(true);
    };


    const handleEditProductChange = (e) => {
        const { name, value } = e.target;

        setEditProductForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleEditImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            alert("You can upload a maximum of 5 new images.");
            return;
        }

        setEditProductImages(files);
    };


    const handleRemoveExistingImage = (publicId) => {
        setExistingImages((prev) =>
            prev.filter((image) => image.public_id !== publicId)
        );
    };


    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        if (!editingProduct) {
            return;
        }

        if (existingImages.length + editProductImages.length > 5) {
            alert("A product can have a maximum of 5 images.");
            return;
        }

        try {
            setUpdatingProduct(true);

            const formData = new FormData();

            formData.append(
                "productName",
                editProductForm.productName
            );

            formData.append(
                "productDesc",
                editProductForm.productDesc
            );

            formData.append(
                "productPrice",
                editProductForm.productPrice
            );

            formData.append(
                "category",
                editProductForm.category
            );

            formData.append(
                "brand",
                editProductForm.brand
            );

            // Tell backend which existing Cloudinary images
            // should remain.
            formData.append(
                "existingImages",
                JSON.stringify(
                    existingImages.map((image) => image.public_id)
                )
            );

            // Add newly selected images.
            editProductImages.forEach((image) => {
                formData.append("files", image);
            });

            const accessToken =
                localStorage.getItem("accessToken") ||
                localStorage.getItem("token");

            if (!accessToken) {
                alert("Authorization token is missing. Please login again.");
                return;
            }

            const response = await axios.put(
                `http://localhost:8000/api/v1/product/update/${editingProduct._id}`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data.success) {
                alert("Product updated successfully!");

                setShowEditProduct(false);
                setEditingProduct(null);

                setEditProductForm({
                    productName: "",
                    productDesc: "",
                    productPrice: "",
                    category: "",
                    brand: "",
                });

                setExistingImages([]);
                setEditProductImages([]);

                fetchProducts();
            }
        } catch (error) {
            console.error(
                "Error updating product:",
                error.response?.data?.message || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to update product. Please try again."
            );
        } finally {
            setUpdatingProduct(false);
        }
    };


    // ============================================================
    // DELETE PRODUCT
    // ============================================================

    const handleDeleteProduct = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.productName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingProductId(product._id);

            const accessToken =
                localStorage.getItem("accessToken") ||
                localStorage.getItem("token");

            if (!accessToken) {
                alert("Authorization token is missing. Please login again.");
                return;
            }

            const response = await axios.delete(
                `http://localhost:8000/api/v1/product/delete/${product._id}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data.success) {
                alert("Product deleted successfully!");

                fetchProducts();
            }
        } catch (error) {
            console.error(
                "Error deleting product:",
                error.response?.data?.message || error.message
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete product. Please try again."
            );
        } finally {
            setDeletingProductId(null);
        }
    };


    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100">
                                <LayoutDashboard className="h-6 w-6 text-pink-600" />
                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-gray-900">
                                    Admin Dashboard
                                </h1>

                                <p className="text-sm text-gray-500">
                                    Manage your ORYN products
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ADD PRODUCT BUTTON */}

                    <button
                        type="button"
                        onClick={() => setShowAddProduct(true)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700"
                    >
                        <Plus size={19} />
                        Add Product
                    </button>

                </div>


                {/* SUMMARY CARD */}

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="rounded-xl border bg-white p-5 shadow-sm">

                        <p className="text-sm font-medium text-gray-500">
                            Total Products
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {products.length}
                        </p>

                    </div>

                </div>


                {/* PRODUCT MANAGEMENT */}

                <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

                    <div className="border-b px-5 py-5">

                        <h2 className="text-lg font-bold text-gray-900">
                            Product Management
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Add, edit and manage products available in your store.
                        </p>

                    </div>


                    {/* LOADING */}

                    {loading ? (

                        <div className="flex min-h-[250px] items-center justify-center">

                            <p className="text-sm text-gray-500">
                                Loading products...
                            </p>

                        </div>

                    ) : products.length === 0 ? (

                        <div className="flex min-h-[250px] flex-col items-center justify-center px-5 text-center">

                            <h3 className="text-lg font-semibold text-gray-800">
                                No products found
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Add your first product to get started.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[850px]">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Product
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Category
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Brand
                                        </th>

                                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Price
                                        </th>

                                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody className="divide-y">

                                    {products.map((product) => (

                                        <tr
                                            key={product._id}
                                            className="transition hover:bg-gray-50"
                                        >

                                            {/* PRODUCT */}

                                            <td className="px-5 py-4">

                                                <div className="flex items-center gap-4">

                                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-gray-100">

                                                        {product.productImg?.[0]?.url ? (

                                                            <img
                                                                src={product.productImg[0].url}
                                                                alt={product.productName}
                                                                className="h-full w-full object-cover"
                                                            />

                                                        ) : (

                                                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                                No image
                                                            </div>

                                                        )}

                                                    </div>


                                                    <div>

                                                        <p className="font-semibold text-gray-900">
                                                            {product.productName}
                                                        </p>

                                                        <p className="mt-1 max-w-xs truncate text-sm text-gray-500">
                                                            {product.productDesc}
                                                        </p>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CATEGORY */}

                                            <td className="px-5 py-4 text-sm text-gray-700">
                                                {product.category || "—"}
                                            </td>


                                            {/* BRAND */}

                                            <td className="px-5 py-4 text-sm text-gray-700">
                                                {product.brand || "—"}
                                            </td>


                                            {/* PRICE */}

                                            <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                                                ₹{product.productPrice}
                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditProduct(product)
                                                        }
                                                        disabled={
                                                            deletingProductId ===
                                                            product._id
                                                        }
                                                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label={`Edit ${product.productName}`}
                                                    >
                                                        <Pencil size={18} />
                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product
                                                            )
                                                        }
                                                        disabled={
                                                            deletingProductId ===
                                                            product._id
                                                        }
                                                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label={`Delete ${product.productName}`}
                                                    >
                                                        {deletingProductId ===
                                                        product._id ? (
                                                            <span className="text-xs font-semibold">
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>


            {/* ====================================================== */}
            {/* ADD PRODUCT MODAL */}
            {/* ====================================================== */}

            {showAddProduct && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Add Product
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Add a new product to your ORYN store.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddProduct(false)
                                }
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                                aria-label="Close"
                            >
                                <X size={21} />
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleAddProduct}
                            className="space-y-5 px-6 py-6"
                        >

                            {/* PRODUCT NAME */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="productName"
                                    value={productForm.productName}
                                    onChange={handleProductChange}
                                    required
                                    placeholder="Enter product name"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Product Description
                                </label>

                                <textarea
                                    name="productDesc"
                                    value={productForm.productDesc}
                                    onChange={handleProductChange}
                                    required
                                    rows="4"
                                    placeholder="Enter product description"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                />

                            </div>


                            {/* PRICE / CATEGORY / BRAND */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="productPrice"
                                        value={productForm.productPrice}
                                        onChange={handleProductChange}
                                        required
                                        min="0"
                                        placeholder="₹"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={productForm.category}
                                        onChange={handleProductChange}
                                        required
                                        placeholder="Category"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Brand
                                    </label>

                                    <input
                                        type="text"
                                        name="brand"
                                        value={productForm.brand}
                                        onChange={handleProductChange}
                                        required
                                        placeholder="Brand"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                    />

                                </div>

                            </div>


                            {/* PRODUCT IMAGES */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Product Images
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-8 transition hover:border-pink-400 hover:bg-pink-50">

                                    <Upload
                                        className="mb-2 text-gray-400"
                                        size={28}
                                    />

                                    <span className="text-sm font-semibold text-gray-700">
                                        Choose product images
                                    </span>

                                    <span className="mt-1 text-xs text-gray-500">
                                        Maximum 5 images
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                </label>


                                {productImages.length > 0 && (

                                    <div className="mt-3">

                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                            {productImages.length} image
                                            {productImages.length > 1
                                                ? "s"
                                                : ""}{" "}
                                            selected
                                        </p>


                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

                                            {productImages.map(
                                                (image, index) => (

                                                    <div
                                                        key={`${image.name}-${index}`}
                                                        className="overflow-hidden rounded-lg border"
                                                    >

                                                        <img
                                                            src={URL.createObjectURL(
                                                                image
                                                            )}
                                                            alt={`Product ${
                                                                index + 1
                                                            }`}
                                                            className="h-20 w-full object-cover"
                                                        />

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>


                            {/* FORM ACTIONS */}

                            <div className="flex justify-end gap-3 border-t pt-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddProduct(false)
                                    }
                                    disabled={addingProduct}
                                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={addingProduct}
                                    className="rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {addingProduct
                                        ? "Adding Product..."
                                        : "Add Product"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ====================================================== */}
            {/* EDIT PRODUCT MODAL */}
            {/* ====================================================== */}

            {showEditProduct && editingProduct && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between border-b px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">
                                    Edit Product
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update your product details.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setShowEditProduct(false)
                                }
                                disabled={updatingProduct}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X size={21} />
                            </button>

                        </div>


                        {/* EDIT FORM */}

                        <form
                            onSubmit={handleUpdateProduct}
                            className="space-y-5 px-6 py-6"
                        >

                            {/* PRODUCT NAME */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="productName"
                                    value={editProductForm.productName}
                                    onChange={handleEditProductChange}
                                    required
                                    placeholder="Enter product name"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Product Description
                                </label>

                                <textarea
                                    name="productDesc"
                                    value={editProductForm.productDesc}
                                    onChange={handleEditProductChange}
                                    required
                                    rows="4"
                                    placeholder="Enter product description"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                />

                            </div>


                            {/* PRICE / CATEGORY / BRAND */}

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="productPrice"
                                        value={editProductForm.productPrice}
                                        onChange={handleEditProductChange}
                                        required
                                        min="0"
                                        placeholder="₹"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={editProductForm.category}
                                        onChange={handleEditProductChange}
                                        required
                                        placeholder="Category"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                    />

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Brand
                                    </label>

                                    <input
                                        type="text"
                                        name="brand"
                                        value={editProductForm.brand}
                                        onChange={handleEditProductChange}
                                        required
                                        placeholder="Brand"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                                    />

                                </div>

                            </div>


                            {/* EXISTING IMAGES */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Existing Images
                                </label>

                                {existingImages.length === 0 ? (

                                    <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
                                        No existing images.
                                    </p>

                                ) : (

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

                                        {existingImages.map((image) => (

                                            <div
                                                key={image.public_id}
                                                className="relative overflow-hidden rounded-lg border"
                                            >

                                                <img
                                                    src={image.url}
                                                    alt="Product"
                                                    className="h-24 w-full object-cover"
                                                />


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveExistingImage(
                                                            image.public_id
                                                        )
                                                    }
                                                    disabled={updatingProduct}
                                                    className="absolute right-1 top-1 rounded-full bg-white p-1.5 text-red-600 shadow transition hover:bg-red-50 disabled:opacity-50"
                                                    aria-label="Remove image"
                                                >
                                                    <X size={15} />
                                                </button>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>


                            {/* ADD NEW IMAGES */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Add New Images
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-7 transition hover:border-pink-400 hover:bg-pink-50">

                                    <Upload
                                        className="mb-2 text-gray-400"
                                        size={28}
                                    />

                                    <span className="text-sm font-semibold text-gray-700">
                                        Choose additional images
                                    </span>

                                    <span className="mt-1 text-xs text-gray-500">
                                        Maximum 5 images total
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleEditImageChange}
                                        className="hidden"
                                    />

                                </label>


                                {editProductImages.length > 0 && (

                                    <div className="mt-3">

                                        <p className="mb-2 text-sm font-medium text-gray-700">
                                            {editProductImages.length} new image
                                            {editProductImages.length > 1
                                                ? "s"
                                                : ""}{" "}
                                            selected
                                        </p>


                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

                                            {editProductImages.map(
                                                (image, index) => (

                                                    <div
                                                        key={`${image.name}-${index}`}
                                                        className="overflow-hidden rounded-lg border"
                                                    >

                                                        <img
                                                            src={URL.createObjectURL(
                                                                image
                                                            )}
                                                            alt={`New product ${
                                                                index + 1
                                                            }`}
                                                            className="h-20 w-full object-cover"
                                                        />

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>


                            {/* FORM ACTIONS */}

                            <div className="flex justify-end gap-3 border-t pt-5">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditProduct(false)
                                    }
                                    disabled={updatingProduct}
                                    className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={updatingProduct}
                                    className="rounded-lg bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {updatingProduct
                                        ? "Updating Product..."
                                        : "Update Product"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Admin;