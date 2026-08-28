import { Link, Route, Routes, useLocation } from "react-router-dom";

import {
    RxDashboard,
    RxCube,
    RxPerson,
    RxReader,
    RxChevronRight,
} from "react-icons/rx";

import {
    FaStore,
    FaSignOutAlt,
} from "react-icons/fa";

import AdminProductPage from "./admin/adminProductPage";
import AdminAddNewProduct from "./admin/adminAddNewProduct";
import AdminUpdateProduct from "./admin/adminUpdataProduct";


export default function AdminPage() {

    const location = useLocation();

    return (

        <div className="w-full h-full flex bg-primary p-2 gap-2">

            {/* =====================================================
                LEFT SIDEBAR
            ====================================================== */}

            <aside
                className="
                    w-[250px]
                    h-full
                    shrink-0
                    flex
                    flex-col
                    overflow-hidden
                    rounded-[22px]
                    bg-primary
                    border-2
                    border-accent
                    shadow-[0_8px_30px_rgba(8,6,22,0.08)]
                "
            >

                {/* =================================================
                    BRAND SECTION
                ================================================== */}

                <div className="px-3 pt-3">

                    <div
                        className="
                            h-[96px]
                            w-full
                            flex
                            items-center
                            rounded-[18px]
                            bg-accent
                            px-4
                            shadow-[0_8px_20px_rgba(8,6,22,0.12)]
                        "
                    >

                        {/* Logo */}

                        <div
                            className="
                                h-[58px]
                                w-[58px]
                                shrink-0
                                flex
                                items-center
                                justify-center
                                overflow-hidden
                                rounded-[18px]
                                bg-accent
                                border
                                border-primary/20
                            "
                        >

                            <img
                                src="/logo.png"
                                alt="VISCO Logo"
                                className="
                                    h-full
                                    w-full
                                    object-contain
                                    p-2
                                "
                            />

                        </div>


                        {/* Brand */}

                        <div className="ml-3 min-w-0">

                            <p
                                className="
                                    text-[15px]
                                    font-bold
                                    tracking-tight
                                    text-primary
                                "
                            >
                                VISCO
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.22em]
                                    text-primary/50
                                "
                            >
                                Admin Panel
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================== */}

                <nav className="flex-1 px-3 pt-7 overflow-hidden">

                    {/* Main Menu */}

                    <div className="px-3 mb-3">

                        <p
                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.25em]
                                text-accent
                            "
                        >
                            Main Menu
                        </p>

                    </div>


                    {/* Dashboard */}

                    <SidebarLink
                        to="/admin"
                        label="Dashboard"
                        icon={<RxDashboard />}
                        active={
                            location.pathname === "/admin" ||
                            location.pathname === "/admin/"
                        }
                    />


                    {/* Orders */}

                    <SidebarLink
                        to="/admin/orders"
                        label="Orders"
                        icon={<RxReader />}
                        active={location.pathname.startsWith(
                            "/admin/orders"
                        )}
                    />


                    {/* Products */}

                    <SidebarLink
                        to="/admin/products"
                        label="Products"
                        icon={<RxCube />}
                        active={
                            location.pathname.startsWith(
                                "/admin/products"
                            ) ||
                            location.pathname.startsWith(
                                "/admin/add-product"
                            ) ||
                            location.pathname.startsWith(
                                "/admin/update-product"
                            )
                        }
                    />


                    {/* Users */}

                    <SidebarLink
                        to="/admin/users"
                        label="Users"
                        icon={<RxPerson />}
                        active={location.pathname.startsWith(
                            "/admin/users"
                        )}
                    />


                    {/* =================================================
                        DIVIDER
                    ================================================== */}

                    <div className="my-6 px-2">

                        <div className="h-px w-full bg-accent/10" />

                    </div>


                    {/* =================================================
                        MANAGEMENT
                    ================================================== */}

                    <div className="px-3 mb-3">

                        <p
                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.25em]
                                text-accent
                            "
                        >
                            Management
                        </p>

                    </div>


                    {/* View Store */}

                    <SidebarLink
                        to="/"
                        label="View Store"
                        icon={<FaStore />}
                    />

                </nav>


                {/* =================================================
                    ADMIN PROFILE
                ================================================== */}

                <div className="p-3">

                    <div
                        className="
                            rounded-[18px]
                            border
                            border-accent/15
                            bg-primary
                            p-3
                            shadow-[0_6px_20px_rgba(8,6,22,0.06)]
                        "
                    >

                        {/* Admin information */}

                        <div className="flex items-center">

                            {/* Avatar */}

                            <div
                                className="
                                    h-10
                                    w-10
                                    shrink-0
                                    flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-accent
                                    text-primary
                                "
                            >

                                <RxPerson className="text-lg" />

                            </div>


                            {/* Details */}

                            <div className="ml-3 min-w-0 flex-1">

                                <p
                                    className="
                                        truncate
                                        text-[11px]
                                        font-bold
                                        text-accent
                                    "
                                >
                                    Administrator
                                </p>


                                <div className="mt-1 flex items-center gap-1.5">

                                    <span
                                        className="
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            bg-green-500
                                        "
                                    />

                                    <span
                                        className="
                                            text-[9px]
                                            font-medium
                                            text-accent
                                        "
                                    >
                                        Online
                                    </span>

                                </div>

                            </div>


                            <RxChevronRight
                                className="
                                    text-sm
                                    text-accent
                                "
                            />

                        </div>


                        {/* Divider */}

                        <div className="my-3 h-px bg-accent/10" />


                        {/* Sign Out */}

                        <button
                            type="button"
                            className="
                                group
                                flex
                                w-full
                                items-center
                                gap-2
                                rounded-xl
                                px-3
                                py-2
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.15em]
                                text-accent
                                transition-all
                                duration-200
                                hover:bg-accent
                                hover:text-primary
                            "
                        >

                            <FaSignOutAlt
                                className="
                                    text-[10px]
                                    transition-transform
                                    duration-200
                                    group-hover:translate-x-0.5
                                "
                            />

                            <span>
                                Sign Out
                            </span>

                        </button>

                    </div>

                </div>

            </aside>


            {/* =====================================================
                RIGHT SIDE
                UNCHANGED
            ====================================================== */}

            <div className="w-[calc(100%-250px)] h-full bg-primary rounded-[20px] border-accent border-3 overflow-hidden justify-center items-center">

                <div className="h-full w-full max-w-full max-h-full overflow-y-scroll">

                    <Routes>

                        <Route
                            path="/"
                            element={<h1>Dashboard</h1>}
                        />

                        <Route
                            path="/users"
                            element={<h1>Users</h1>}
                        />

                        <Route
                            path="/products"
                            element={<AdminProductPage />}
                        />

                        <Route
                            path="/orders"
                            element={<h1>Orders</h1>}
                        />

                        <Route
                            path="/add-product"
                            element={<AdminAddNewProduct />}
                        />

                        <Route
                            path="/update-product"
                            element={<AdminUpdateProduct />}
                        />

                        <Route
                            path="/*"
                            element={<h1>404 Not Found</h1>}
                        />

                    </Routes>

                </div>

            </div>

        </div>
    );
}


/* =========================================================
   SIDEBAR LINK COMPONENT
========================================================= */

function SidebarLink({
    to,
    label,
    icon,
    active = false,
}) {

    return (

        <Link
            to={to}
            className={`
                group
                relative
                mb-2
                flex
                h-[52px]
                w-full
                items-center
                rounded-[14px]
                px-3
                transition-all
                duration-200

                ${
                    active
                        ? `
                            bg-accent
                            text-primary
                            shadow-[0_6px_18px_rgba(8,6,22,0.16)]
                        `
                        : `
                            bg-transparent
                            text-accent
                            hover:bg-accent/5
                            hover:text-accent
                        `
                }
            `}
        >

            {/* Active left indicator */}

            {active && (

                <span
                    className="
                        absolute
                        -left-[1px]
                        top-1/2
                        h-6
                        w-[3px]
                        -translate-y-1/2
                        rounded-r-full
                        bg-primary
                    "
                />

            )}


            {/* Icon */}

            <span
                className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    text-[16px]
                    transition-all
                    duration-200

                    ${
                        active
                            ? `
                                bg-primary
                                text-accent
                            `
                            : `
                                bg-accent/5
                                text-accent
                                group-hover:bg-accent/10
                                group-hover:text-accent
                            `
                    }
                `}
            >

                {icon}

            </span>


            {/* Label */}

            <span
                className={`
                    ml-3
                    flex-1
                    text-[11px]
                    font-semibold
                    tracking-wide
                    ${
                        active
                            ? "text-primary"
                            : "text-accent group-hover:text-accent"
                    }
                `}
            >
                {label}
            </span>


            {/* Arrow */}

            <RxChevronRight
                className={`
                    text-[14px]
                    transition-all
                    duration-200

                    ${
                        active
                            ? `
                                translate-x-0
                                text-primary/45
                            `
                            : `
                                -translate-x-1
                                text-accent
                                group-hover:translate-x-0
                                group-hover:text-accent
                            `
                    }
                `}
            />

        </Link>

    );
}