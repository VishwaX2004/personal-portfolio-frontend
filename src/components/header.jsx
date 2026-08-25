import { Link } from "react-router-dom";

export default function Header() {

    return (
        <header className='w-full h-[90px] bg-accent flex items-center justify-between text-white px-[15px]'>

            <div className="w-full h-full flex relative">

                <img src="logo.png" alt="" className='h-full h-full object-cover absolute left-0 top-0' />

                <div className="h-full flex justify-center items-center gap-[35px] text-[18px] font-semibold ml-[20px] w-full">

                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/shop" className="hover:text-gray-300">Shop</Link>
                    <Link to="/about" className="hover:text-gray-300">About</Link>
                    <Link to="/contact" className="hover:text-gray-300">Contact</Link>

                </div>

            </div>

        </header>
    )

} 