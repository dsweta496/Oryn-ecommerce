import React, { useEffect, useState } from "react";
import axios from "axios";
import.meta.env.VITE_API_URL
import {
    LayoutDashboard,
    Plus,
    Pencil,
    Trash2,
    X,
    Upload,
    Package,
    WalletCards,
    TrendingUp,
    ShoppingBag,
    ImagePlus,
    BarChart3,
    IndianRupee,
    Boxes,
    Receipt,
    ArrowLeft,
} from "lucide-react";

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [incomeStats, setIncomeStats] = useState({
        lifetimeIncome: 0,
        yearlyIncome: 0,
    });

    const [incomeLoading, setIncomeLoading] = useState(true);

    const [productAnalytics, setProductAnalytics] = useState([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [selectedAnalyticsProduct, setSelectedAnalyticsProduct] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

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

    const [deletingProductId, setDeletingProductId] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/product/getAllProducts`
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

    const fetchIncomeStats = async () => {
        try {
            setIncomeLoading(true);

            const accessToken =
                localStorage.getItem("accessToken") ||
                localStorage.getItem("token");

            if (!accessToken) {
                console.error("Authorization token is missing.");
                return;
            }

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/order/admin/stats`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.data.success) {
                setIncomeStats({
                    lifetimeIncome: res.data.lifetimeIncome || 0,
                    yearlyIncome: res.data.yearlyIncome || 0,
                });
            }
        } catch (error) {
            console.error(
                "Error fetching income statistics:",
                error.response?.data?.message || error.message
            );
        } finally {
            setIncomeLoading(false);
        }
    };

    const fetchProductAnalytics = async () => {
        try {
            setAnalyticsLoading(true);
            const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
            if (!accessToken) {
                console.error("Authorization token is missing.");
                return;
            }
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/order/admin/product-analytics`,
                { withCredentials: true, headers: { Authorization: `Bearer ${accessToken}` } }
            );
            if (res.data.success) setProductAnalytics(res.data.analytics || []);
        } catch (error) {
            console.error("Error fetching product analytics:", error.response?.data?.message || error.message);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchIncomeStats();
        fetchProductAnalytics();
    }, []);

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
                `${import.meta.env.VITE_API_URL}/api/v1/product/add`,
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

            formData.append(
                "existingImages",
                JSON.stringify(
                    existingImages.map((image) => image.public_id)
                )
            );

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
                `${import.meta.env.VITE_API_URL}/api/v1/product/update/${editingProduct._id}`,
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
                `${import.meta.env.VITE_API_URL}/api/v1/product/delete/${product._id}`,
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

    const formatCurrency = (value) => {
        return `₹${Number(value || 0).toLocaleString("en-IN")}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-7xl">

                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100">
                            <LayoutDashboard
                                size={28}
                                className="text-pink-600"
                            />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                Admin Dashboard
                            </h1>

                            <p className="mt-1 text-sm text-slate-500">
                                Manage your ORYN store and monitor sales.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowAddProduct(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-pink-700 hover:shadow-md"
                    >
                        <Plus size={19} />
                        Add Product
                    </button>
                </div>

                <div className="mb-8 flex justify-center">
                    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                        <button
                            type="button"
                            onClick={() => setActiveTab("overview")}
                            className={`rounded-lg px-6 py-3 text-sm font-semibold transition ${
                                activeTab === "overview"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                        >
                            Dashboard
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab("analytics")}
                            className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition ${
                                activeTab === "analytics"
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                            }`}
                        >
                            <BarChart3 size={17} />
                            Product Analytics
                        </button>
                    </div>
                </div>

                {activeTab === "overview" && (
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Total Products
                                </p>

                                <p className="mt-3 text-4xl font-bold text-slate-900">
                                    {products.length}
                                </p>

                                <p className="mt-2 text-xs text-slate-400">
                                    Products currently listed
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50">
                                <Package
                                    size={22}
                                    className="text-pink-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Income This Year
                                </p>

                                <p className="mt-3 text-4xl font-bold text-slate-900">
                                    {incomeLoading
                                        ? "..."
                                        : formatCurrency(
                                              incomeStats.yearlyIncome
                                          )}
                                </p>

                                <p className="mt-2 text-xs text-slate-400">
                                    Successful sales this year
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                                <TrendingUp
                                    size={22}
                                    className="text-emerald-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Lifetime Income
                                </p>

                                <p className="mt-3 text-4xl font-bold text-slate-900">
                                    {incomeLoading
                                        ? "..."
                                        : formatCurrency(
                                              incomeStats.lifetimeIncome
                                          )}
                                </p>

                                <p className="mt-2 text-xs text-slate-400">
                                    Total successful sales
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
                                <WalletCards
                                    size={22}
                                    className="text-violet-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {activeTab === "overview" && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                <ShoppingBag
                                    size={20}
                                    className="text-slate-700"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Product Management
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add, edit and manage products available in your store.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                            {products.length}{" "}
                            {products.length === 1
                                ? "product"
                                : "products"}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex min-h-[300px] flex-col items-center justify-center px-5">
                            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-600" />

                            <p className="text-sm font-medium text-slate-600">
                                Loading products...
                            </p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex min-h-[320px] flex-col items-center justify-center px-5 text-center">
                            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50">
                                <Package
                                    size={30}
                                    className="text-pink-500"
                                />
                            </div>

                            <h3 className="text-lg font-semibold text-slate-800">
                                No products found
                            </h3>

                            <p className="mt-2 max-w-sm text-sm text-slate-500">
                                Your store does not have any products yet.
                                Add your first product to get started.
                            </p>

                            <button
                                type="button"
                                onClick={() => setShowAddProduct(true)}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
                            >
                                <Plus size={17} />
                                Add First Product
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px]">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Product
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Category
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Brand
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Price
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {products.map((product) => (
                                        <tr
                                            key={product._id}
                                            className="transition hover:bg-slate-50/70"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                        {product.productImg?.[0]
                                                            ?.url ? (
                                                            <img
                                                                src={
                                                                    product
                                                                        .productImg[0]
                                                                        .url
                                                                }
                                                                alt={
                                                                    product.productName
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <ImagePlus
                                                                    size={20}
                                                                    className="text-slate-400"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-slate-900">
                                                            {
                                                                product.productName
                                                            }
                                                        </p>

                                                        <p className="mt-1 max-w-sm truncate text-sm text-slate-500">
                                                            {
                                                                product.productDesc
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                                                    {product.category || "—"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                                {product.brand || "—"}
                                            </td>

                                            <td className="px-6 py-5 text-sm font-bold text-slate-900">
                                                {formatCurrency(
                                                    product.productPrice
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditProduct(
                                                                product
                                                            )
                                                        }
                                                        disabled={
                                                            deletingProductId ===
                                                            product._id
                                                        }
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label={`Edit ${product.productName}`}
                                                    >
                                                        <Pencil size={18} />
                                                    </button>

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
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        aria-label={`Delete ${product.productName}`}
                                                    >
                                                        {deletingProductId ===
                                                        product._id ? (
                                                            <span className="text-xs font-bold">
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
                )}

                {activeTab === "analytics" && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50"><BarChart3 size={21} className="text-pink-600" /></div>
                            <div><h2 className="text-xl font-bold text-slate-900">Product Sales Analytics</h2><p className="mt-1 text-sm text-slate-500">Track lifetime sales performance for every product.</p></div>
                        </div>
                        <div className="rounded-full bg-pink-50 px-4 py-2 text-sm font-medium text-pink-600">{productAnalytics.length} {productAnalytics.length === 1 ? "product" : "products"} sold</div>
                    </div>
                    {analyticsLoading ? (
                        <div className="flex min-h-[260px] flex-col items-center justify-center"><div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-pink-600" /><p className="text-sm font-medium text-slate-600">Loading sales analytics...</p></div>
                    ) : productAnalytics.length === 0 ? (
                        <div className="flex min-h-[260px] flex-col items-center justify-center px-5 text-center"><div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100"><BarChart3 size={27} className="text-slate-400" /></div><h3 className="text-lg font-semibold text-slate-800">No sales yet</h3><p className="mt-2 text-sm text-slate-500">Product sales will appear here once orders are placed.</p></div>
                    ) : (
                        <div className="overflow-x-auto"><table className="w-full min-w-[850px]"><thead><tr className="border-b border-slate-200 bg-slate-50"><th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th><th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Units Sold</th><th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">Orders</th><th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Revenue</th><th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Details</th></tr></thead><tbody className="divide-y divide-slate-100">
                            {productAnalytics.map((item) => (
                                <tr key={item.productId} className="transition hover:bg-slate-50">
                                    <td className="px-6 py-5"><p className="font-semibold text-slate-900">{item.productName}</p><p className="mt-1 max-w-[280px] truncate text-xs text-slate-400">ID: {item.productId}</p></td>
                                    <td className="px-6 py-5 text-center"><span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700"><Boxes size={15} />{item.unitsSold}</span></td>
                                    <td className="px-6 py-5 text-center"><span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700"><Receipt size={15} />{item.orderCount}</span></td>
                                    <td className="px-6 py-5 text-right"><p className="font-bold text-slate-900">{formatCurrency(item.totalRevenue)}</p><p className="mt-1 text-xs text-slate-400">Avg. {formatCurrency(item.averageSellingPrice)}</p></td>
                                    <td className="px-6 py-5 text-right"><button type="button" onClick={() => setSelectedAnalyticsProduct(item)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"><BarChart3 size={16} />View Analytics</button></td>
                                </tr>
                            ))}
                        </tbody></table></div>
                    )}
                </div>
                )}
            </div>

            {showAddProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Add Product
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Add a new product to your ORYN store.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowAddProduct(false)
                                }
                                disabled={addingProduct}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleAddProduct}
                            className="space-y-6 px-6 py-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="productName"
                                    value={productForm.productName}
                                    onChange={handleProductChange}
                                    required
                                    placeholder="Enter product name"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Product Description
                                </label>

                                <textarea
                                    name="productDesc"
                                    value={productForm.productDesc}
                                    onChange={handleProductChange}
                                    required
                                    rows="4"
                                    placeholder="Enter product description"
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={productForm.category}
                                        onChange={handleProductChange}
                                        required
                                        placeholder="Category"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Brand
                                    </label>

                                    <input
                                        type="text"
                                        name="brand"
                                        value={productForm.brand}
                                        onChange={handleProductChange}
                                        required
                                        placeholder="Brand"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Product Images
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-9 transition hover:border-pink-400 hover:bg-pink-50">
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                                        <Upload
                                            size={24}
                                            className="text-pink-500"
                                        />
                                    </div>

                                    <span className="text-sm font-semibold text-slate-700">
                                        Choose product images
                                    </span>

                                    <span className="mt-1 text-xs text-slate-500">
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
                                    <div className="mt-4">
                                        <p className="mb-3 text-sm font-medium text-slate-700">
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
                                                        className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
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

                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowAddProduct(false)
                                    }
                                    disabled={addingProduct}
                                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={addingProduct}
                                    className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            {showEditProduct && editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Edit Product
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update your product details.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowEditProduct(false)
                                }
                                disabled={updatingProduct}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50"
                                aria-label="Close"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdateProduct}
                            className="space-y-6 px-6 py-6"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="productName"
                                    value={editProductForm.productName}
                                    onChange={handleEditProductChange}
                                    required
                                    placeholder="Enter product name"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Product Description
                                </label>

                                <textarea
                                    name="productDesc"
                                    value={editProductForm.productDesc}
                                    onChange={handleEditProductChange}
                                    required
                                    rows="4"
                                    placeholder="Enter product description"
                                    className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="productPrice"
                                        value={
                                            editProductForm.productPrice
                                        }
                                        onChange={handleEditProductChange}
                                        required
                                        min="0"
                                        placeholder="₹"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={editProductForm.category}
                                        onChange={handleEditProductChange}
                                        required
                                        placeholder="Category"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Brand
                                    </label>

                                    <input
                                        type="text"
                                        name="brand"
                                        value={editProductForm.brand}
                                        onChange={handleEditProductChange}
                                        required
                                        placeholder="Brand"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-pink-500 focus:ring-4 focus:ring-pink-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Existing Images
                                    </label>

                                    <span className="text-xs text-slate-400">
                                        {existingImages.length}/5
                                    </span>
                                </div>

                                {existingImages.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                                        No existing images.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                                        {existingImages.map((image) => (
                                            <div
                                                key={image.public_id}
                                                className="group relative overflow-hidden rounded-xl border border-slate-200"
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
                                                    disabled={
                                                        updatingProduct
                                                    }
                                                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition hover:bg-red-50 disabled:opacity-50"
                                                    aria-label="Remove image"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-semibold text-slate-700">
                                    Add New Images
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 transition hover:border-pink-400 hover:bg-pink-50">
                                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                                        <Upload
                                            size={22}
                                            className="text-pink-500"
                                        />
                                    </div>

                                    <span className="text-sm font-semibold text-slate-700">
                                        Choose additional images
                                    </span>

                                    <span className="mt-1 text-xs text-slate-500">
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
                                    <div className="mt-4">
                                        <p className="mb-3 text-sm font-medium text-slate-700">
                                            {editProductImages.length} new
                                            image
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
                                                        className="overflow-hidden rounded-xl border border-slate-200"
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

                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowEditProduct(false)
                                    }
                                    disabled={updatingProduct}
                                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={updatingProduct}
                                    className="rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
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

            {selectedAnalyticsProduct && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
                    <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                            <div className="flex items-center gap-3"><button type="button" onClick={() => setSelectedAnalyticsProduct(null)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100"><ArrowLeft size={19} /></button><div><p className="text-xs font-semibold uppercase tracking-wider text-pink-600">Sales Analytics</p><h2 className="text-xl font-bold text-slate-900">{selectedAnalyticsProduct.productName}</h2></div></div>
                            <button type="button" onClick={() => setSelectedAnalyticsProduct(null)} className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100" aria-label="Close analytics"><X size={21} /></button>
                        </div>
                        <div className="p-6">
                            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100"><IndianRupee size={20} className="text-pink-600" /></div><p className="text-sm text-slate-500">Total Revenue</p><p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(selectedAnalyticsProduct.totalRevenue)}</p></div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100"><Boxes size={20} className="text-blue-600" /></div><p className="text-sm text-slate-500">Units Sold</p><p className="mt-2 text-3xl font-bold text-slate-900">{selectedAnalyticsProduct.unitsSold}</p></div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100"><Receipt size={20} className="text-violet-600" /></div><p className="text-sm text-slate-500">Orders</p><p className="mt-2 text-3xl font-bold text-slate-900">{selectedAnalyticsProduct.orderCount}</p></div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="rounded-2xl border border-slate-200 p-6"><p className="text-sm font-medium text-slate-500">Product</p><h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedAnalyticsProduct.productName}</h3><div className="mt-6 space-y-4"><div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span className="text-sm text-slate-500">Product ID</span><span className="max-w-[220px] truncate text-sm font-medium text-slate-800">{selectedAnalyticsProduct.productId}</span></div><div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span className="text-sm text-slate-500">Average Selling Price</span><span className="text-sm font-semibold text-slate-900">{formatCurrency(selectedAnalyticsProduct.averageSellingPrice)}</span></div><div className="flex justify-between gap-4"><span className="text-sm text-slate-500">Last Sold</span><span className="text-sm font-semibold text-slate-900">{selectedAnalyticsProduct.lastSoldAt ? new Date(selectedAnalyticsProduct.lastSoldAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</span></div></div></div>
                                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-pink-50 to-white p-6"><p className="text-sm font-medium text-slate-500">Sales Performance</p><p className="mt-3 text-4xl font-bold text-pink-600">{formatCurrency(selectedAnalyticsProduct.totalRevenue)}</p><p className="mt-2 text-sm text-slate-500">generated from <span className="font-semibold text-slate-700">{selectedAnalyticsProduct.unitsSold}</span> units across <span className="font-semibold text-slate-700">{selectedAnalyticsProduct.orderCount}</span> orders.</p><div className="mt-8 rounded-2xl bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-4"><span className="text-sm text-slate-500">Revenue per unit</span><span className="font-bold text-slate-900">{formatCurrency(selectedAnalyticsProduct.averageSellingPrice)}</span></div></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;