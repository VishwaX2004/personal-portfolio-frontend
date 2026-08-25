import axios from "axios";
import { useEffect, useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import {
    FaRegEdit,
    FaRegTrashAlt,
    FaBoxOpen,
    FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminProductPage() {

    const [products, setProducts] = useState([]);

    useEffect(() => {

        axios.get(import.meta.env.VITE_API_URL + "/api/products").then(
            (response) => {
                setProducts(response.data);
            }
        )
    }, [])

    return (
        <div className="min-h-full w-full bg-primary p-4 sm:p-6 lg:p-8 text-accent">

            {/* =========================
                PAGE HEADER
            ========================== */}
            <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-accent/50">
                        Inventory Management
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Products
                    </h1>

                    <p className="mt-1 text-sm text-accent/60">
                        Manage your products, pricing and inventory.
                    </p>
                </div>

                {/* Add Product */}
                <Link
                    to="/admin/add-product"
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-primary shadow-lg shadow-accent/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"
                >
                    <CiCirclePlus className="text-2xl transition-transform duration-300 group-hover:rotate-90" />

                    <span>
                        Add Product
                    </span>
                </Link>

            </div>


            {/* =========================
                STAT / SUMMARY CARD
            ========================== */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* Total Products */}
                <div className="group rounded-2xl border border-accent/10 bg-primary/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-accent/50">
                                Total Products
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {products.length}
                            </h2>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary shadow-md">
                            <FaBoxOpen className="text-xl" />
                        </div>

                    </div>

                </div>

                {/* Inventory */}
                <div className="group rounded-2xl border border-accent/10 bg-primary/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-accent/50">
                                Inventory Status
                            </p>

                            <h2 className="mt-2 text-xl font-bold">
                                Active
                            </h2>

                            <p className="mt-1 text-xs text-accent/50">
                                Products are available for management
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/10 bg-white/40">
                            <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]"></span>
                        </div>

                    </div>

                </div>

                {/* Management */}
                <div className="hidden rounded-2xl border border-accent/10 bg-accent p-5 text-primary shadow-sm lg:block">

                    <p className="text-xs font-semibold uppercase tracking-wider text-primary/50">
                        Quick Management
                    </p>

                    <p className="mt-2 text-sm leading-6 text-primary/70">
                        Add, edit and manage your product catalog from one place.
                    </p>

                </div>

            </div>


            {/* =========================
                PRODUCT TABLE CARD
            ========================== */}
            <div className="overflow-hidden rounded-3xl border border-accent/10 bg-white/30 shadow-sm backdrop-blur-sm">

                {/* Table Header */}
                <div className="flex flex-col gap-4 border-b border-accent/10 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="text-lg font-bold">
                            Product Catalog
                        </h2>

                        <p className="mt-1 text-xs text-accent/50">
                            {products.length} product{products.length !== 1 ? "s" : ""} in your catalog
                        </p>
                    </div>

                    {/* Search UI - visual only, logic unchanged */}
                    <div className="flex w-full items-center gap-3 rounded-xl border border-accent/10 bg-primary/60 px-4 py-2.5 sm:w-[260px]">

                        <FaSearch className="text-sm text-accent/40" />

                        <span className="text-sm text-accent/40">
                            Search products...
                        </span>

                    </div>

                </div>


                {/* =========================
                    RESPONSIVE TABLE
                ========================== */}
                <div className="w-full overflow-x-auto">

                    <table className="w-full min-w-[1050px] border-collapse">

                        {/* Table Head */}
                        <thead>

                            <tr className="border-b border-accent/10 bg-accent/[0.03]">

                                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-accent/50">
                                    Product
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-accent/50">
                                    Product ID
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-accent/50">
                                    Name
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-accent/50">
                                    Price
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-accent/50">
                                    Labelled Price
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-accent/50">
                                    Stock
                                </th>

                                <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-accent/50">
                                    Category
                                </th>

                                <th className="px-5 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-accent/50">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        {/* Table Body */}
                        <tbody>

                            {products.map(
                                (item) => {

                                    return (

                                        <tr
                                            key={item.productID}
                                            className="group border-b border-accent/[0.07] transition-all duration-200 hover:bg-accent/[0.025]"
                                        >

                                            {/* Product Image */}
                                            <td className="px-5 py-4">

                                                <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-accent/10 bg-primary shadow-sm">

                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />

                                                </div>

                                            </td>


                                            {/* Product ID */}
                                            <td className="px-5 py-4">

                                                <span className="rounded-lg bg-accent/[0.05] px-2.5 py-1 font-mono text-xs font-medium text-accent/70">
                                                    {item.productID}
                                                </span>

                                            </td>


                                            {/* Name */}
                                            <td className="px-5 py-4">

                                                <div className="max-w-[220px]">

                                                    <p className="truncate text-sm font-semibold text-accent">
                                                        {item.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-accent/40">
                                                        Product
                                                    </p>

                                                </div>

                                            </td>


                                            {/* Price */}
                                            <td className="px-5 py-4">

                                                <span className="text-sm font-bold">
                                                    Rs. {item.price}
                                                </span>

                                            </td>


                                            {/* Labelled Price */}
                                            <td className="px-5 py-4">

                                                <span className="text-sm text-accent/50 line-through">
                                                    Rs. {item.labelledPrice}
                                                </span>

                                            </td>


                                            {/* Stock */}
                                            <td className="px-5 py-4">

                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                        item.stock > 0
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-600"
                                                    }`}
                                                >

                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            item.stock > 0
                                                                ? "bg-green-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    ></span>

                                                    {item.stock > 0
                                                        ? `${item.stock} in stock`
                                                        : "Out of stock"
                                                    }

                                                </span>

                                            </td>


                                            {/* Category */}
                                            <td className="px-5 py-4">

                                                <span className="inline-flex rounded-lg border border-accent/10 bg-primary px-3 py-1.5 text-xs font-medium text-accent/70">
                                                    {item.category}
                                                </span>

                                            </td>


                                            {/* Actions */}
                                            <td className="px-5 py-4">

                                                <div className="flex items-center justify-center gap-2">

                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        className="group/edit flex h-9 w-9 items-center justify-center rounded-xl border border-accent/10 bg-primary text-accent/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-primary hover:shadow-md"
                                                    >
                                                        <FaRegEdit className="text-sm transition-transform duration-200 group-hover/edit:scale-110" />
                                                    </button>


                                                    {/* Delete */}
                                                    <button
                                                        type="button"
                                                        className="group/delete flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white hover:shadow-md"
                                                    >
                                                        <FaRegTrashAlt className="text-sm transition-transform duration-200 group-hover/delete:scale-110" />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )

                                }
                            )}

                        </tbody>

                    </table>

                </div>


                {/* Empty State */}
                {products.length === 0 && (

                    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary shadow-lg">
                            <FaBoxOpen className="text-2xl" />
                        </div>

                        <h3 className="text-lg font-bold">
                            No products found
                        </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-accent/50">
                            Your product catalog is currently empty. Add your first product to get started.
                        </p>

                        <Link
                            to="/admin/add-product"
                            className="mt-5 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            Add Your First Product
                        </Link>

                    </div>

                )}

            </div>


            {/* =========================
                FOOTER INFO
            ========================== */}
            <div className="mt-5 flex flex-col gap-2 text-xs text-accent/40 sm:flex-row sm:items-center sm:justify-between">

                <p>
                    Product Management
                </p>

                <p>
                    Showing {products.length} product{products.length !== 1 ? "s" : ""}
                </p>

            </div>

        </div>
    )
}