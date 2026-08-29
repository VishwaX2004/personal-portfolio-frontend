import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage() {

    const [products, setProducts] = useState([]);
    const [isloading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isloading) {
            axios
                .get(import.meta.env.VITE_API_URL + "/api/products")
                .then((response) => {
                    setProducts(response.data);
                    setIsLoading(false)
                }).catch((error) => {
                    toast.error("Error fetching products");
                    setIsLoading(false)
                })
        }
    }, [isloading]);


    return (
        <div className="w-full h-[calc(100vh-90px)]">
            {
                isloading ? <Loader/> :
                <div className="w-full h-full flex flex-col gap-[20px] p-[15px] overflow-y-auto">
                    {
                        products.map((item) => {
                            return (
                                <div key={item.productID}>
                                    <ProductCard product={item} />
                                </div>
                            )
                        })
                    }
                </div>
            }

        </div>
    )

}