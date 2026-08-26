import { Link, Route, Routes } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import AdminProductPage from "./admin/adminProductPage";
import AdminAddNewProduct from "./admin/adminAddNewProduct";

export default function AdminPage() {
    return (
        <div className='w-full h-full flex bg-primary p-2'>

            <div className="w-[250px] h-full bg-primary flex flex-col gap-[20px]">

                <div className="flex flex-row w-full h-[80px] bg-amber-500 items-center rounded-3xl">
                    <img src="logo.png" alt="Logo" className="h-[80px]" />
                    <span className="text-2xl font-bold ml-2 mr-2">Admin Panel</span>
                </div>

                <Link to="/admin" className="flex items-center gap-2">
                    <RxDashboard />
                    <span>Dashboard</span>
                </Link>

                <Link to="/admin/orders" className="flex items-center gap-2">
                    <RxDashboard />
                    <span>Orders</span>
                </Link>

                <Link to="/admin/products" className="flex items-center gap-2">
                    <RxDashboard />
                    <span>Products</span>
                </Link>

                <Link to="/admin/users" className="flex items-center gap-2">
                    <RxDashboard />
                    <span>Users</span>
                </Link>

            </div>

            <div className="w-[calc(100%-250px)] h-full bg-primary rounded-[20px] border-accent border-3 overflow-hidden justify-center items-center">

                <div className="h-full w-full max-w-full max-h-full overflow-y-scroll">
                    <Routes>
                        <Route path="/" element={<h1>Dashboard</h1>} />
                        <Route path="/users" element={<h1>Users</h1>} />
                        <Route path="/products" element={<AdminProductPage />} />
                        <Route path="/orders" element={<h1>Orders</h1>} />
                        <Route path="/add-product" element={<AdminAddNewProduct />} />
                        <Route path="/*" element={<h1>404 Not Found</h1>} />

                    </Routes>
                </div>

            </div>

        </div>
    )
}