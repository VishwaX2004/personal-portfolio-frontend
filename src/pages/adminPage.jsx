import { Route, Routes } from "react-router-dom";

export default function AdminPage() {
    return (
        <div className='w-full h-full flex bg-primary p-2'>

            <div className="w-[280px] h-full bg-primary">

            </div>

            <div className="w-[calc(100%-280px)] h-full bg-primary rounded-[20px] border-accent border-3">

                <Routes path="/">
                    <Route path="/dashboard" element={<h1>Dashboard</h1>} />
                    <Route path="/users" element={<h1>Users</h1>} />
                    <Route path="/products" element={<h1>Products</h1>} />
                    <Route path="/orders" element={<h1>Orders</h1>} />
                </Routes>

            </div>

        </div>
    )
}