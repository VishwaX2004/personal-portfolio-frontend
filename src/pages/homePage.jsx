import { Route, Routes } from "react-router-dom";
import Header from "../components/header";

export default function HomePage() {
    return (
        <div className='w-full h-full flex flex-col bg-primary'>

            <Header />

            <Routes path="/">
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/shop" element={<h1>Shop</h1>} />
                <Route path="/about" element={<h1>About</h1>} />
                <Route path="/contact" element={<h1>Contact</h1>} />
                <Route path="/*" element={<h1>404 Not Found</h1>} />
            </Routes>

        </div>
    )
}