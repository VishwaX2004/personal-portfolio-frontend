
import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <footer className="w-full bg-accent text-white">

            {/* Main Footer */}
            <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-16 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

                    {/* Brand */}
                    <div className="lg:col-span-1">

                        <Link
                            to="/"
                            className="inline-block group mb-6"
                        >
                            <img
                                src="/logo.png"
                                alt="Visco Clothing"
                                className="w-[130px] h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        </Link>

                        <p className="text-white/55 text-sm leading-7 max-w-[300px]">
                            Discover timeless fashion designed for those who
                            appreciate effortless style, quality, and confidence.
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-3 mt-7">

                            <a
                                href="#"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-sm font-medium hover:bg-primary hover:text-accent hover:border-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                IG
                            </a>

                            <a
                                href="#"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-sm font-medium hover:bg-primary hover:text-accent hover:border-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                FB
                            </a>

                            <a
                                href="#"
                                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-sm font-medium hover:bg-primary hover:text-accent hover:border-primary hover:-translate-y-1 transition-all duration-300"
                            >
                                TK
                            </a>

                        </div>

                    </div>


                    {/* Shop */}
                    <div>

                        <h3 className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-6">
                            Shop
                        </h3>

                        <div className="flex flex-col gap-4">

                            <Link
                                to="/shop"
                                className="text-white/55 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300"
                            >
                                All Products
                            </Link>

                            <Link
                                to="/shop"
                                className="text-white/55 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300"
                            >
                                New Arrivals
                            </Link>

                            <Link
                                to="/shop"
                                className="text-white/55 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300"
                            >
                                Best Sellers
                            </Link>

                            <Link
                                to="/shop"
                                className="text-white/55 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300"
                            >
                                Collections
                            </Link>

                        </div>

                    </div>


                    {/* Company */}
                    <div>

                        <h3 className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-6">
                            Company
                        </h3>

                        <div className="flex flex-col gap-4">

                            <Link
                                to="/"
                                className="text-white/55 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300"
                            >
                                Home
                            </Link>

                            <Link
                                to="/about"
                                className="text-white/55 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300"
                            >
                                About Us
                            </Link>

                            <Link
                                to="/contact"
                                className="text-white/55 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300"
                            >
                                Contact
                            </Link>

                            <Link
                                to="/login"
                                className="text-white/55 text-sm hover:text-primary hover:translate-x-1 transition-all duration-300"
                            >
                                My Account
                            </Link>

                        </div>

                    </div>


                    {/* Newsletter */}
                    <div>

                        <h3 className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-6">
                            Stay Updated
                        </h3>

                        <p className="text-white/55 text-sm leading-6 mb-5">
                            Subscribe to receive updates about new collections,
                            exclusive offers, and fashion inspiration.
                        </p>

                        <div className="flex w-full h-[46px]">

                            <input
                                type="email"
                                placeholder="Your email address"
                                className="min-w-0 flex-1 bg-white/5 border border-white/10 rounded-l-xl px-4 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/50 transition-all duration-300"
                            />

                            <button
                                className="w-[48px] bg-primary text-accent rounded-r-xl font-bold hover:bg-white hover:scale-[1.02] transition-all duration-300"
                            >
                                →
                            </button>

                        </div>

                        <p className="text-white/25 text-[11px] mt-3">
                            By subscribing, you agree to our privacy policy.
                        </p>

                    </div>

                </div>

            </div>


            {/* Bottom Section */}
            <div className="border-t border-white/10">

                <div className="max-w-[1500px] mx-auto px-6 md:px-10 lg:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    <p className="text-white/35 text-xs text-center md:text-left">
                        © {new Date().getFullYear()} Visco Clothing. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">

                        <Link
                            to="/"
                            className="text-white/35 text-xs hover:text-primary transition-colors duration-300"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            to="/"
                            className="text-white/35 text-xs hover:text-primary transition-colors duration-300"
                        >
                            Terms & Conditions
                        </Link>

                    </div>

                </div>

            </div>

        </footer>
    );
}

