
export default function ProductCard(props) {
    const product = props.product;

    return (
        <div className="group w-[320px] h-[455px] bg-primary rounded-2xl overflow-hidden border border-accent/15 shadow-[0_8px_25px_rgba(8,6,22,0.08)] hover:shadow-[0_18px_45px_rgba(8,6,22,0.18)] hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-wrap">

            {/* ================= IMAGE ================= */}
            <div className="relative w-full h-[265px] overflow-hidden bg-white">

                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />

                {/* Soft Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-accent/25 via-transparent to-transparent pointer-events-none"></div>

                {/* Category */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex px-3 py-1.5 rounded-full bg-primary text-accent text-[10px] font-bold uppercase tracking-[0.12em] shadow-md">
                        {product.category}
                    </span>
                </div>

                {/* Wishlist */}
                <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-accent shadow-md hover:bg-accent hover:text-primary hover:scale-105 transition-all duration-300"
                >
                    <span className="text-[21px] leading-none">
                        ♡
                    </span>
                </button>

                {/* Hover View Button */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <span className="px-4 py-2 rounded-full bg-primary text-accent text-[10px] font-bold uppercase tracking-[0.12em] shadow-lg whitespace-nowrap">
                        Quick View
                    </span>
                </div>

            </div>


            {/* ================= DETAILS ================= */}
            <div className="px-5 pt-4 pb-5 h-[190px] flex flex-col">

                {/* Product Name */}
                <div>
                    <h1 className="text-accent text-[18px] font-bold leading-tight tracking-tight line-clamp-1">
                        {product.name}
                    </h1>

                    {/* Small Accent Line */}
                    <div className="w-7 h-[2px] bg-accent mt-2 mb-2 rounded-full group-hover:w-11 transition-all duration-300"></div>

                    {/* Description */}
                    <p className="text-secondary text-[13px] font-medium leading-[1.45] line-clamp-2">
                        {product.description}
                    </p>
                </div>


                {/* ================= PRICE ================= */}
                <div className="mt-auto">

                    <div className="flex items-center justify-between mb-3">

                        <div className="flex items-center gap-2">

                            {product.labelledPrice > product.price ? (
                                <>
                                    <span className="text-accent text-[21px] font-extrabold">
                                        ${product.price}
                                    </span>

                                    <span className="text-secondary/55 text-[13px] font-medium line-through">
                                        ${product.labelledPrice}
                                    </span>

                                    <span className="px-2 py-1 rounded-md bg-accent text-primary text-[9px] font-bold uppercase tracking-wider">
                                        Sale
                                    </span>
                                </>
                            ) : (
                                <span className="text-accent text-[21px] font-extrabold">
                                    ${product.price}
                                </span>
                            )}

                        </div>

                    </div>


                    {/* ================= SHOP BUTTON ================= */}
                    <button
                        className="w-full h-[43px] bg-accent text-primary rounded-xl text-[12px] font-bold uppercase tracking-[0.1em] flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:bg-secondary active:scale-[0.98] transition-all duration-300"
                    >
                        <span>
                            Shop Now
                        </span>

                        <span className="text-[15px] transition-transform duration-300 group-hover:translate-x-1">
                            →
                        </span>
                    </button>

                </div>

            </div>

        </div>
    );
}

