import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios
            .get(import.meta.env.VITE_API_URL + "/api/products")
            .then((response) => {
                setProducts(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                toast.error("Error fetching products");
                setIsLoading(false);
            });
    }, []);

    return (
        <main className="w-full bg-primary">

            {isLoading ? (
                <div className="w-full min-h-[calc(100vh-90px)] flex items-center justify-center">
                    <Loader />
                </div>
            ) : (
                <div className="w-full max-w-[1500px] mx-auto px-6 md:px-10 lg:px-16 py-8">

                    {/* Page Header */}
                    <div className="mb-8">
                        <p className="text-accent/50 text-xs uppercase tracking-[0.3em] mb-2">
                            Our Collection
                        </p>

                        <h1 className="text-accent text-3xl md:text-4xl font-bold tracking-tight">
                            Shop Our Collection
                        </h1>

                        <p className="text-secondary/60 text-sm mt-2">
                            Discover timeless pieces designed for your everyday style.
                        </p>
                    </div>

                    {/* Products */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                            {products.map((item) => (
                                <div
                                    key={item.productID}
                                    className="w-full flex justify-center"
                                >
                                    <ProductCard product={item} />
                                </div>
                            ))}

                        </div>
                    ) : (
                        <div className="w-full min-h-[400px] flex flex-col items-center justify-center text-center">

                            <div className="w-16 h-16 rounded-full bg-accent/5 flex items-center justify-center mb-4">
                                <span className="text-2xl">
                                    🛍️
                                </span>
                            </div>

                            <h2 className="text-accent text-xl font-semibold">
                                No Products Found
                            </h2>

                            <p className="text-secondary/50 text-sm mt-2">
                                There are currently no products available.
                            </p>

                        </div>
                    )}

                </div>
            )}

        </main>
    );
}