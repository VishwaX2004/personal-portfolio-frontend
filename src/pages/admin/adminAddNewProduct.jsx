import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import mediaUpload from "../../utils/mediaUpload";


export default function AdminAddNewProduct() {

    const navigate = useNavigate();

    const [productID, setProductID] = useState("");
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");

    const [images, setImages] = useState([]);

    const [price, setPrice] = useState("");
    const [labelledPrice, setLabelledPrice] = useState("");

    const [category, setCategory] = useState("");
    const [material, setMaterial] = useState("");
    const [gender, setGender] = useState("");
    const [brand, setBrand] = useState("");

    const [selectedSizes, setSelectedSizes] =
        useState([]);

    const [selectedColors, setSelectedColors] =
        useState([]);

    const [variants, setVariants] =
        useState([]);

    const [loading, setLoading] =
        useState(false);


    const sizes = [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL"
    ];


    const colors = [
        "Black",
        "White",
        "Grey",
        "Navy",
        "Red",
        "Blue",
        "Green",
        "Brown",
        "Beige"
    ];


    const categories = [
        "T-Shirts",
        "Shirts",
        "Pants",
        "Jeans",
        "Shorts",
        "Dresses",
        "Skirts",
        "Jackets",
        "Hoodies",
        "Sweaters",
        "Accessories"
    ];


    function toggleSize(size) {

        setSelectedSizes((current) =>
            current.includes(size)
                ? current.filter(
                    (item) => item !== size
                )
                : [...current, size]
        );

    }

    function toggleColor(color) {

        setSelectedColors((current) =>
            current.includes(color)
                ? current.filter(
                    (item) => item !== color
                )
                : [...current, color]
        );

    }

    function addVariant() {

        if (
            selectedSizes.length === 0 ||
            selectedColors.length === 0
        ) {

            toast.error(
                "Select at least one size and one color."
            );

            return;
        }

        const newVariants = [];

        selectedSizes.forEach((size) => {

            selectedColors.forEach((color) => {

                const exists =
                    variants.some(
                        (variant) =>
                            variant.size === size &&
                            variant.color === color
                    );


                if (!exists) {

                    newVariants.push({
                        size,
                        color,
                        stock: 0,
                        sku: "",
                        isAvailable: true
                    });

                }

            });

        });


        if (newVariants.length === 0) {

            toast.error(
                "These variants already exist."
            );

            return;
        }


        setVariants((current) => [
            ...current,
            ...newVariants
        ]);


        toast.success(
            `${newVariants.length} variant${
                newVariants.length > 1
                    ? "s"
                    : ""
            } added`
        );

    }


    function updateVariant(
        index,
        field,
        value
    ) {

        setVariants((current) =>
            current.map(
                (variant, i) =>
                    i === index
                        ? {
                            ...variant,
                            [field]: value
                        }
                        : variant
            )
        );

    }


    function removeVariant(index) {

        setVariants((current) =>
            current.filter(
                (_, i) => i !== index
            )
        );

    }

    async function addProduct() {

        const token =
            localStorage.getItem("token");


        if (!token) {

            navigate("/login");

            return;
        }


        if (!productID.trim()) {

            toast.error(
                "Enter a product ID."
            );

            return;
        }


        if (!name.trim()) {

            toast.error(
                "Enter a product name."
            );

            return;
        }


        if (!description.trim()) {

            toast.error(
                "Enter a product description."
            );

            return;
        }


        if (
            price === "" ||
            Number(price) < 0
        ) {

            toast.error(
                "Enter a valid selling price."
            );

            return;
        }


        if (
            labelledPrice === "" ||
            Number(labelledPrice) < 0
        ) {

            toast.error(
                "Enter a valid labelled price."
            );

            return;
        }


        if (!category) {

            toast.error(
                "Select a category."
            );

            return;
        }


        if (!gender) {

            toast.error(
                "Select a gender."
            );

            return;
        }


        if (!brand.trim()) {

            toast.error(
                "Enter a brand."
            );

            return;
        }


        if (variants.length === 0) {

            toast.error(
                "Add at least one size and color variant."
            );

            return;
        }


        if (images.length === 0) {

            toast.error(
                "Please select at least one image."
            );

            return;
        }

        try {

            setLoading(true);
            const uploadPromises =
                images.map((file) =>
                    mediaUpload(file)
                );


            const imageUrls =
                await Promise.all(
                    uploadPromises
                );

            if (
                !imageUrls.every(
                    (url) =>
                        typeof url === "string"
                )
            ) {

                throw new Error(
                    "Image upload returned an invalid URL."
                );

            }

            const altNameList =
                altNames
                    .split(",")
                    .map(
                        (item) =>
                            item.trim()
                    )
                    .filter(Boolean);


            const cleanedVariants =
                variants.map(
                    (variant) => {

                        const cleanedVariant = {

                            size:
                                variant.size,

                            color:
                                variant.color,

                            stock:
                                Number(
                                    variant.stock
                                ) || 0,

                            isAvailable:
                                Number(
                                    variant.stock
                                ) > 0
                                    ? true
                                    : Boolean(
                                        variant.isAvailable
                                    )

                        };


                        if (
                            variant.sku &&
                            variant.sku.trim() !== ""
                        ) {

                            cleanedVariant.sku =
                                variant.sku.trim();

                        }

                        return cleanedVariant;

                    }
                );


            const productData = {

                productID:
                    productID.trim(),

                name:
                    name.trim(),

                altNames:
                    altNameList,

                description:
                    description.trim(),

                images:
                    imageUrls,

                price:
                    Number(price),

                labelledPrice:
                    Number(labelledPrice),

                category:

                    category,

                gender:
                    gender,

                brand:
                    brand.trim(),

                material:
                    material.trim(),

                variants:
                    cleanedVariants

            };


            console.log(
                "Sending product data:",
                productData
            );


            const apiUrl =
                import.meta.env.VITE_API_URL;


            if (!apiUrl) {

                throw new Error(
                    "VITE_API_URL is not configured."
                );

            }


            await axios.post(
                `${apiUrl}/api/products`,
                productData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"
                    }
                }
            );


            toast.success(
                "Product added successfully!"
            );


            navigate(
                "/admin/products"
            );


        } catch (error) {

            console.error(
                "Error adding product:",
                error
            );


            console.error(
                "Server response:",
                error?.response?.data
            );


            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Error adding product.";


            toast.error(message);


        } finally {

            setLoading(false);

        }

    }


    const totalStock =
        variants.reduce(
            (total, variant) =>
                total +
                Number(
                    variant.stock || 0
                ),
            0
        );


    return (

        <div className="min-h-full w-full bg-primary px-4 py-6 text-accent sm:px-6 lg:px-8">

            <div className="mx-auto mb-7 max-w-7xl">

                <div className="mb-3 flex items-center gap-3">

                    <span className="h-px w-10 bg-accent/40" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent/60">
                        VISCO / ADMIN
                    </span>

                </div>


                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Add New Product
                </h1>


                <p className="mt-2 max-w-xl text-sm leading-6 text-accent/65">
                    Add a clothing product with
                    images, pricing, sizes, colors
                    and variant-level inventory.
                </p>

            </div>


            <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-accent/15 bg-white/40 shadow-[0_25px_80px_-35px_rgba(8,6,22,0.35)]">

                <div className="p-5 sm:p-7 lg:p-9">

                    <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">

                        {/* LEFT */}

                        <div className="space-y-9 xl:col-span-8">

                            {/* BASIC INFORMATION */}

                            <section>

                                <SectionTitle
                                    number="01"
                                    title="Basic Information"
                                    description="Core product details"
                                />


                                <div className="grid gap-5 md:grid-cols-2">

                                    <InputField
                                        label="Product ID"
                                        placeholder="VIS-TS-001"
                                        value={productID}
                                        onChange={(e) =>
                                            setProductID(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <InputField
                                        label="Product Name"
                                        placeholder="Classic Oversized T-Shirt"
                                        value={name}
                                        onChange={(e) =>
                                            setName(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="mt-5">

                                    <InputField
                                        label="Alternative Names"
                                        placeholder="Oversized Tee, Casual Tee"
                                        value={altNames}
                                        onChange={(e) =>
                                            setAltNames(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <p className="mt-1 text-[10px] text-accent/40">
                                        Separate multiple names with commas.
                                    </p>

                                </div>


                                <div className="mt-5">

                                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                        Description
                                    </label>


                                    <textarea
                                        rows="6"
                                        placeholder="Describe the fit, style, fabric and important product details..."
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(
                                                e.target.value
                                            )
                                        }
                                        className="w-full resize-none rounded-2xl border border-accent/15 bg-primary px-4 py-3.5 text-sm leading-6 text-accent outline-none placeholder:text-accent/35 focus:border-accent/35 focus:ring-4 focus:ring-accent/10"
                                    />

                                </div>

                            </section>


                            {/* PRICING */}

                            <section>

                                <SectionTitle
                                    number="02"
                                    title="Pricing"
                                    description="Set your product pricing"
                                />


                                <div className="grid gap-5 sm:grid-cols-2">

                                    <PriceInput
                                        label="Selling Price"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <PriceInput
                                        label="Labelled Price"
                                        value={labelledPrice}
                                        onChange={(e) =>
                                            setLabelledPrice(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </section>


                            {/* IMAGES */}

                            <section>

                                <SectionTitle
                                    number="03"
                                    title="Product Images"
                                    description="Upload clear product photographs"
                                />


                                <label
                                    htmlFor="product-images"
                                    className="group flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-accent/20 bg-primary/60 p-8 text-center transition hover:border-accent/40 hover:bg-white/50"
                                >

                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary shadow-lg transition group-hover:-translate-y-1">

                                        <svg
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >

                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M3 16.5l4.5-4.5a2.25 2.25 0 013.182 0L15 16.5m-3-3l1.318-1.318a2.25 2.25 0 013.182 0L21 16.5M4.5 19.5h15A1.5 1.5 0 0021 18V6a1.5 1.5 0 00-1.5-1.5h-15A1.5 1.5 0 003 6v12a1.5 1.5 0 001.5 1.5z"
                                            />

                                        </svg>

                                    </div>


                                    <p className="text-sm font-bold">

                                        {images.length > 0
                                            ? `${images.length} image${images.length > 1 ? "s" : ""} selected`
                                            : "Upload product images"
                                        }

                                    </p>


                                    <p className="mt-1 text-xs text-accent/50">
                                        JPG, PNG or WEBP
                                    </p>


                                    <input
                                        id="product-images"
                                        type="file"
                                        multiple
                                        accept="image/png,image/jpeg,image/webp"
                                        onChange={(e) =>
                                            setImages(
                                                Array.from(
                                                    e.target.files || []
                                                )
                                            )
                                        }
                                        className="hidden"
                                    />

                                </label>


                                {images.length > 0 && (

                                    <div className="mt-3 space-y-1">

                                        {images.map(
                                            (image, index) => (

                                                <div
                                                    key={`${image.name}-${index}`}
                                                    className="flex items-center justify-between rounded-lg bg-primary px-3 py-2 text-xs"
                                                >

                                                    <span className="max-w-[80%] truncate">
                                                        {image.name}
                                                    </span>

                                                    <span className="text-accent/40">
                                                        {(
                                                            image.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </span>

                                                </div>

                                            )
                                        )}

                                    </div>

                                )}

                            </section>


                            {/* VARIANTS */}

                            <section>

                                <SectionTitle
                                    number="04"
                                    title="Size & Color Variants"
                                    description="Create stock combinations for your clothing"
                                />


                                <div className="rounded-2xl border border-accent/15 bg-white/40 p-5">

                                    <div>

                                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                            Available Sizes
                                        </p>


                                        <div className="flex flex-wrap gap-2">

                                            {sizes.map(
                                                (size) => {

                                                    const active =
                                                        selectedSizes.includes(
                                                            size
                                                        );


                                                    return (

                                                        <button
                                                            type="button"
                                                            key={size}
                                                            onClick={() =>
                                                                toggleSize(
                                                                    size
                                                                )
                                                            }
                                                            className={`h-10 min-w-12 rounded-xl border px-4 text-xs font-bold transition ${
                                                                active
                                                                    ? "border-accent bg-accent text-primary shadow-md"
                                                                    : "border-accent/15 bg-primary text-accent hover:border-accent/35"
                                                            }`}
                                                        >
                                                            {size}
                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    </div>


                                    <div className="mt-7">

                                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                            Available Colors
                                        </p>


                                        <div className="flex flex-wrap gap-2">

                                            {colors.map(
                                                (color) => {

                                                    const active =
                                                        selectedColors.includes(
                                                            color
                                                        );


                                                    return (

                                                        <button
                                                            type="button"
                                                            key={color}
                                                            onClick={() =>
                                                                toggleColor(
                                                                    color
                                                                )
                                                            }
                                                            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                                                active
                                                                    ? "border-accent bg-accent text-primary"
                                                                    : "border-accent/15 bg-primary text-accent hover:border-accent/35"
                                                            }`}
                                                        >
                                                            {color}
                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={addVariant}
                                        className="mt-7 w-full rounded-xl bg-accent px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition hover:-translate-y-0.5 hover:shadow-lg"
                                    >
                                        Generate Variants
                                    </button>

                                </div>


                                {variants.length > 0 && (

                                    <div className="mt-5 overflow-hidden rounded-2xl border border-accent/15">

                                        <div className="flex items-center justify-between bg-accent px-4 py-3 text-primary">

                                            <div>

                                                <p className="text-xs font-bold">
                                                    Product Variants
                                                </p>

                                                <p className="mt-0.5 text-[9px] text-primary/60">
                                                    {variants.length} combinations
                                                </p>

                                            </div>


                                            <span className="rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold">
                                                {totalStock} units
                                            </span>

                                        </div>


                                        <div className="overflow-x-auto">

                                            <table className="w-full min-w-[650px] text-left">

                                                <thead className="bg-primary">

                                                    <tr>

                                                        <th className="px-4 py-3 text-[9px] uppercase tracking-wider">
                                                            Size
                                                        </th>

                                                        <th className="px-4 py-3 text-[9px] uppercase tracking-wider">
                                                            Color
                                                        </th>

                                                        <th className="px-4 py-3 text-[9px] uppercase tracking-wider">
                                                            Stock
                                                        </th>

                                                        <th className="px-4 py-3 text-[9px] uppercase tracking-wider">
                                                            SKU
                                                        </th>

                                                        <th className="px-4 py-3" />

                                                    </tr>

                                                </thead>


                                                <tbody>

                                                    {variants.map(
                                                        (
                                                            variant,
                                                            index
                                                        ) => (

                                                            <tr
                                                                key={`${variant.size}-${variant.color}-${index}`}
                                                                className="border-t border-accent/10"
                                                            >

                                                                <td className="px-4 py-3">

                                                                    <span className="inline-flex rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold">
                                                                        {variant.size}
                                                                    </span>

                                                                </td>


                                                                <td className="px-4 py-3">

                                                                    <span className="inline-flex rounded-full border border-accent/15 bg-primary px-3 py-1.5 text-xs font-semibold">
                                                                        {variant.color}
                                                                    </span>

                                                                </td>


                                                                <td className="px-4 py-3">

                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={variant.stock}
                                                                        onChange={(e) =>
                                                                            updateVariant(
                                                                                index,
                                                                                "stock",
                                                                                Math.max(
                                                                                    0,
                                                                                    Number(
                                                                                        e.target.value
                                                                                    )
                                                                                )
                                                                            )
                                                                        }
                                                                        className="h-10 w-24 rounded-lg border border-accent/15 bg-white px-3 text-sm outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
                                                                    />

                                                                </td>


                                                                <td className="px-4 py-3">

                                                                    <input
                                                                        type="text"
                                                                        placeholder="Optional SKU"
                                                                        value={variant.sku}
                                                                        onChange={(e) =>
                                                                            updateVariant(
                                                                                index,
                                                                                "sku",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="h-10 w-40 rounded-lg border border-accent/15 bg-white px-3 text-sm outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
                                                                    />

                                                                </td>


                                                                <td className="px-4 py-3 text-right">

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeVariant(
                                                                                index
                                                                            )
                                                                        }
                                                                        className="rounded-lg px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                                                                    >
                                                                        Remove
                                                                    </button>

                                                                </td>

                                                            </tr>

                                                        )
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                )}

                            </section>

                        </div>


                        {/* RIGHT */}

                        <div className="space-y-6 xl:col-span-4">

                            <section className="rounded-2xl border border-accent/15 bg-primary/70 p-5 sm:p-6">

                                <SectionTitle
                                    number="05"
                                    title="Classification"
                                    description="Organize your clothing product"
                                />


                                <div className="space-y-5">

                                    <SelectField
                                        label="Category"
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select category
                                        </option>


                                        {categories.map(
                                            (item) => (

                                                <option
                                                    key={item}
                                                    value={item}
                                                >
                                                    {item}
                                                </option>

                                            )
                                        )}

                                    </SelectField>


                                    <SelectField
                                        label="Gender"
                                        value={gender}
                                        onChange={(e) =>
                                            setGender(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select gender
                                        </option>

                                        <option value="Men">
                                            Men
                                        </option>

                                        <option value="Women">
                                            Women
                                        </option>

                                        <option value="Unisex">
                                            Unisex
                                        </option>

                                        <option value="Kids">
                                            Kids
                                        </option>

                                    </SelectField>


                                    <InputField
                                        label="Brand"
                                        placeholder="VISCO"
                                        value={brand}
                                        onChange={(e) =>
                                            setBrand(
                                                e.target.value
                                            )
                                        }
                                    />


                                    <InputField
                                        label="Material"
                                        placeholder="100% Cotton"
                                        value={material}
                                        onChange={(e) =>
                                            setMaterial(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            </section>


                            <section className="rounded-2xl bg-accent p-6 text-primary shadow-xl">

                                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary/50">
                                    Product Summary
                                </p>


                                <h3 className="mt-3 break-words text-2xl font-light">
                                    {name ||
                                        "Your product"}
                                </h3>


                                <div className="mt-6 space-y-3 border-t border-primary/10 pt-5">

                                    <SummaryRow
                                        label="Product ID"
                                        value={
                                            productID ||
                                            "Not set"
                                        }
                                    />

                                    <SummaryRow
                                        label="Category"
                                        value={
                                            category ||
                                            "Not selected"
                                        }
                                    />

                                    <SummaryRow
                                        label="Gender"
                                        value={
                                            gender ||
                                            "Not selected"
                                        }
                                    />

                                    <SummaryRow
                                        label="Sizes"
                                        value={
                                            selectedSizes.length
                                                ? selectedSizes.join(
                                                    ", "
                                                )
                                                : "None"
                                        }
                                    />

                                    <SummaryRow
                                        label="Colors"
                                        value={
                                            selectedColors.length
                                                ? selectedColors.join(
                                                    ", "
                                                )
                                                : "None"
                                        }
                                    />

                                    <SummaryRow
                                        label="Variants"
                                        value={
                                            variants.length
                                        }
                                    />

                                    <SummaryRow
                                        label="Total Stock"
                                        value={
                                            totalStock
                                        }
                                    />

                                    <SummaryRow
                                        label="Images"
                                        value={
                                            images.length
                                        }
                                    />

                                </div>

                            </section>

                        </div>

                    </div>

                </div>


                <div className="border-t border-accent/15 bg-white/20 px-5 py-5 sm:px-7 lg:px-9">

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                            className="rounded-xl border border-accent/20 bg-primary px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-accent transition hover:border-accent/40 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            disabled={loading}
                            onClick={addProduct}
                            className="rounded-xl bg-accent px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading
                                ? "Saving Product..."
                                : "Add Product →"
                            }

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}


/* Section title */

function SectionTitle({
    number,
    title,
    description
}) {

    return (

        <div className="mb-5 flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-[9px] font-bold text-primary">
                {number}
            </div>


            <div>

                <h2 className="text-sm font-bold tracking-tight text-accent">
                    {title}
                </h2>

                <p className="mt-1 text-[10px] text-accent/55">
                    {description}
                </p>

            </div>

        </div>

    );

}


/* Text input */

function InputField({
    label,
    placeholder,
    value,
    onChange
}) {

    return (

        <div>

            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
                {label}
            </label>


            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="h-12 w-full rounded-xl border border-accent/15 bg-primary px-4 text-sm font-medium text-accent outline-none placeholder:text-accent/35 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
            />

        </div>

    );

}


/* Price input */

function PriceInput({
    label,
    value,
    onChange
}) {

    return (

        <div>

            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
                {label}
            </label>


            <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-accent/50">
                    Rs.
                </span>


                <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={value}
                    onChange={onChange}
                    className="h-12 w-full rounded-xl border border-accent/15 bg-primary pl-11 pr-4 text-sm font-medium text-accent outline-none placeholder:text-accent/35 focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
                />

            </div>

        </div>

    );

}


/* Select */

function SelectField({
    label,
    value,
    onChange,
    children
}) {

    return (

        <div>

            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
                {label}
            </label>


            <select
                value={value}
                onChange={onChange}
                className="h-12 w-full rounded-xl border border-accent/15 bg-primary px-4 text-sm font-medium text-accent outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/10"
            >
                {children}
            </select>

        </div>

    );

}


/* Summary row */

function SummaryRow({
    label,
    value
}) {

    return (

        <div className="flex items-center justify-between gap-4">

            <span className="shrink-0 text-[10px] uppercase tracking-wider text-primary/45">
                {label}
            </span>


            <span className="max-w-[60%] truncate text-right text-xs font-medium text-primary/85">
                {value}
            </span>

        </div>

    );

}