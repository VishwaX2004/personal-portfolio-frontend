
import { Link } from "react-router-dom";
import { User, Heart, Search, ShoppingBag } from "lucide-react";

export default function Header() {

    return (
        <header className="sticky top-0 z-50 w-full h-[90px] bg-accent text-white border-b border-white/10">

            <div className="w-full h-full max-w-[1500px] mx-auto px-6 lg:px-10 flex items-center justify-between">

                {/* Logo */}
                <Link
                    to="/"
                    className="relative h-full w-[150px] flex items-center group"
                >
                    <img
                        src="logo.png"
                        alt="Logo"
                        className="w-[125px] h-auto object-contain transition-all duration-500 group-hover:scale-105"
                    />

                    {/* Logo Glow */}
                    <div className="absolute left-0 w-[100px] h-[30px] bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>


                {/* Navigation */}
                <nav className="hidden md:flex items-center justify-center gap-10 lg:gap-12 h-full">

                    <Link
                        to="/"
                        className="relative h-full flex items-center text-[14px] font-medium tracking-wide text-white/80 hover:text-white transition-colors duration-300 group"
                    >
                        Home

                        <span className="absolute bottom-[24px] left-0 w-0 h-[2px] bg-primary rounded-full group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    <Link
                        to="/shop"
                        className="relative h-full flex items-center text-[14px] font-medium tracking-wide text-white/80 hover:text-white transition-colors duration-300 group"
                    >
                        Shop

                        <span className="absolute bottom-[24px] left-0 w-0 h-[2px] bg-primary rounded-full group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    <Link
                        to="/about"
                        className="relative h-full flex items-center text-[14px] font-medium tracking-wide text-white/80 hover:text-white transition-colors duration-300 group"
                    >
                        About

                        <span className="absolute bottom-[24px] left-0 w-0 h-[2px] bg-primary rounded-full group-hover:w-full transition-all duration-300"></span>
                    </Link>

                    <Link
                        to="/contact"
                        className="relative h-full flex items-center text-[14px] font-medium tracking-wide text-white/80 hover:text-white transition-colors duration-300 group"
                    >
                        Contact

                        <span className="absolute bottom-[24px] left-0 w-0 h-[2px] bg-primary rounded-full group-hover:w-full transition-all duration-300"></span>
                    </Link>

                </nav>


                {/* Right Actions */}
                <div className="flex items-center gap-2">

                    {/* Search */}
                    <button
                        className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        title="Search"
                    >
                        <Search size={19} strokeWidth={1.7} />
                    </button>


                    {/* Wishlist */}
                    <button
                        className="relative w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        title="Wishlist"
                    >
                        <Heart
                            size={19}
                            strokeWidth={1.7}
                            className="transition-transform duration-300 hover:scale-110"
                        />

                        {/* Wishlist Badge */}
                        <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-primary rounded-full"></span>
                    </button>


                    {/* Shopping Bag */}
                    <button
                        className="relative w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        title="Shopping Bag"
                    >
                        <ShoppingBag size={19} strokeWidth={1.7} />
                    </button>


                    {/* Divider */}
                    <div className="hidden sm:block w-px h-7 bg-white/10 mx-2"></div>


                    {/* Login Button */}
                    <Link
                        to="/login"
                        className="group relative hidden sm:flex items-center gap-2 h-[42px] px-5 rounded-full bg-primary text-accent text-[13px] font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.03]"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            <User
                                size={17}
                                strokeWidth={2}
                                className="transition-transform duration-300 group-hover:rotate-6"
                            />

                            Login
                        </span>

                        {/* Hover animation */}
                        <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    </Link>


                    {/* Mobile Profile */}
                    <button
                        className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full bg-primary text-accent hover:scale-105 transition-all duration-300"
                    >
                        <User size={18} strokeWidth={2} />
                    </button>

                </div>

            </div>

        </header>
    );
}

