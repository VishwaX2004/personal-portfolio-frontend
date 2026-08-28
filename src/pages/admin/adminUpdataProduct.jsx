import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    FaArrowLeft,
    FaCheck,
    FaCloudUploadAlt,
    FaImage,
    FaTimes,
    FaTrash,
} from "react-icons/fa";

import mediaUpload from "../../utils/mediaUpload";

export default function AdminProductUpdate() {
    const location = useLocation();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    /*
     * ---------------------------------------------------------
     * PRODUCT DATA
     * ---------------------------------------------------------
     */

    const product = location.state || null;

    const [productID, setProductID] = useState(
        product?.productID || ""
    );

    const [name, setName] = useState(
        product?.name || ""
    );

    const [altNames, setAltNames] = useState(
        Array.isArray(product?.altNames)
            ? product.altNames.join(", ")
            : product?.altNames || ""
    );

    const [description, setDescription] = useState(
        product?.description || ""
    );

    const [price, setPrice] = useState(
        product?.price ?? ""
    );

    const [labelledPrice, setLabelledPrice] = useState(
        product?.labelledPrice ?? ""
    );

    const [category, setCategory] = useState(
        product?.category || ""
    );

    const [gender, setGender] = useState(
        product?.gender || ""
    );

    const [brand, setBrand] = useState(
        product?.brand || ""
    );

    const [material, setMaterial] = useState(
        product?.material || ""
    );

    /*
     * Existing images already stored in MongoDB
     */
    const [existingImages, setExistingImages] = useState(
        Array.isArray(product?.images)
            ? product.images
            : []
    );

    /*
     * New files selected from computer
     */
    const [newImages, setNewImages] = useState([]);

    /*
     * Variants
     */
    const [variants, setVariants] = useState(
        Array.isArray(product?.variants)
            ? product.variants.map((variant) => ({
                  ...variant,
                  stock: Number(variant.stock ?? 0),
                  sku: variant.sku || "",
                  isAvailable:
                      typeof variant.isAvailable === "boolean"
                          ? variant.isAvailable
                          : Number(variant.stock ?? 0) > 0,
              }))
            : []
    );

    const [loading, setLoading] = useState(false);

    /*
     * ---------------------------------------------------------
     * CONSTANTS
     * ---------------------------------------------------------
     */

    const sizes = [
        "XS",
        "S",
        "M",
        "L",
        "XL",
        "XXL",
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
        "Beige",
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
        "Accessories",
    ];

    const genders = [
        "Men",
        "Women",
        "Unisex",
        "Kids",
    ];

    /*
     * ---------------------------------------------------------
     * SAFETY
     * ---------------------------------------------------------
     */

    useEffect(() => {
        if (!product?.productID) {
            toast.error(
                "Product information is missing."
            );

            navigate("/admin/products");
        }
    }, [product, navigate]);

    /*
     * ---------------------------------------------------------
     * SIZE / COLOR HELPERS
     * ---------------------------------------------------------
     */

    const selectedSizes = useMemo(() => {
        return [
            ...new Set(
                variants
                    .map((variant) => variant.size)
                    .filter(Boolean)
            ),
        ];
    }, [variants]);

    const selectedColors = useMemo(() => {
        return [
            ...new Set(
                variants
                    .map((variant) => variant.color)
                    .filter(Boolean)
            ),
        ];
    }, [variants]);

    function toggleSize(size) {
        const exists = selectedSizes.includes(size);

        if (exists) {
            /*
             * Remove every variant using this size.
             */
            setVariants((current) =>
                current.filter(
                    (variant) =>
                        variant.size !== size
                )
            );

            return;
        }

        /*
         * Just selecting a size does not create a variant.
         * User must click Generate Variants.
         */
    }

    function toggleColor(color) {
        const exists = selectedColors.includes(color);

        if (exists) {
            /*
             * Remove every variant using this color.
             */
            setVariants((current) =>
                current.filter(
                    (variant) =>
                        variant.color !== color
                )
            );

            return;
        }

        /*
         * Just selecting a color does not create a variant.
         */
    }

    /*
     * Temporary selections for generating variants.
     *
     * These are initialized from existing variants.
     */
    const [generationSizes, setGenerationSizes] =
        useState(selectedSizes);

    const [generationColors, setGenerationColors] =
        useState(selectedColors);

    /*
     * Keep generation selections synchronized when
     * variants are initially loaded.
     */
    useEffect(() => {
        if (
            generationSizes.length === 0 &&
            selectedSizes.length > 0
        ) {
            setGenerationSizes(selectedSizes);
        }

        if (
            generationColors.length === 0 &&
            selectedColors.length > 0
        ) {
            setGenerationColors(selectedColors);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function toggleGenerationSize(size) {
        setGenerationSizes((current) =>
            current.includes(size)
                ? current.filter(
                      (item) => item !== size
                  )
                : [...current, size]
        );
    }

    function toggleGenerationColor(color) {
        setGenerationColors((current) =>
            current.includes(color)
                ? current.filter(
                      (item) => item !== color
                  )
                : [...current, color]
        );
    }

    /*
     * ---------------------------------------------------------
     * VARIANT GENERATION
     * ---------------------------------------------------------
     */

    function addVariant() {
        if (
            generationSizes.length === 0 ||
            generationColors.length === 0
        ) {
            toast.error(
                "Select at least one size and one color."
            );

            return;
        }

        const newVariants = [];

        generationSizes.forEach((size) => {
            generationColors.forEach((color) => {
                const exists = variants.some(
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
                        isAvailable: false,
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
            ...newVariants,
        ]);

        toast.success(
            `${newVariants.length} variant${
                newVariants.length > 1
                    ? "s"
                    : ""
            } added`
        );
    }

    /*
     * ---------------------------------------------------------
     * VARIANT UPDATE
     * ---------------------------------------------------------
     */

    function updateVariant(
        index,
        field,
        value
    ) {
        setVariants((current) =>
            current.map((variant, i) => {
                if (i !== index) {
                    return variant;
                }

                const updated = {
                    ...variant,
                    [field]: value,
                };

                /*
                 * Stock controls availability.
                 *
                 * If stock becomes 0, automatically disable
                 * availability.
                 */
                if (field === "stock") {
                    const stock =
                        Math.max(
                            0,
                            Number(value) || 0
                        );

                    updated.stock = stock;

                    if (stock === 0) {
                        updated.isAvailable = false;
                    }
                }

                return updated;
            })
        );
    }

    function toggleVariantAvailability(index) {
        setVariants((current) =>
            current.map((variant, i) => {
                if (i !== index) {
                    return variant;
                }

                if (Number(variant.stock) <= 0) {
                    toast.error(
                        "A variant with 0 stock cannot be available."
                    );

                    return {
                        ...variant,
                        isAvailable: false,
                    };
                }

                return {
                    ...variant,
                    isAvailable:
                        !variant.isAvailable,
                };
            })
        );
    }

    function removeVariant(index) {
        setVariants((current) =>
            current.filter(
                (_, i) => i !== index
            )
        );

        toast.success(
            "Variant removed."
        );
    }

    /*
     * ---------------------------------------------------------
     * IMAGE HANDLING
     * ---------------------------------------------------------
     */

    function handleImageSelect(event) {
        const files = Array.from(
            event.target.files || []
        );

        if (files.length === 0) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        const invalidFiles = files.filter(
            (file) =>
                !allowedTypes.includes(
                    file.type
                )
        );

        if (invalidFiles.length > 0) {
            toast.error(
                "Only JPG, PNG and WEBP images are allowed."
            );

            return;
        }

        /*
         * Maximum 5 MB per image.
         */
        const oversizedFiles = files.filter(
            (file) =>
                file.size >
                5 * 1024 * 1024
        );

        if (oversizedFiles.length > 0) {
            toast.error(
                "Each image must be smaller than 5 MB."
            );

            return;
        }

        setNewImages((current) => [
            ...current,
            ...files,
        ]);

        /*
         * Reset input so selecting the same file again
         * still triggers onChange.
         */
        event.target.value = "";
    }

    function removeNewImage(index) {
        setNewImages((current) =>
            current.filter(
                (_, i) => i !== index
            )
        );
    }

    function removeExistingImage(index) {
        setExistingImages((current) =>
            current.filter(
                (_, i) => i !== index
            )
        );
    }

    /*
     * ---------------------------------------------------------
     * VALIDATION
     * ---------------------------------------------------------
     */

    function validateProduct() {
        if (!productID.trim()) {
            toast.error(
                "Product ID is required."
            );

            return false;
        }

        if (!name.trim()) {
            toast.error(
                "Product name is required."
            );

            return false;
        }

        if (!description.trim()) {
            toast.error(
                "Product description is required."
            );

            return false;
        }

        if (
            price === "" ||
            Number.isNaN(Number(price)) ||
            Number(price) < 0
        ) {
            toast.error(
                "Enter a valid selling price."
            );

            return false;
        }

        if (
            labelledPrice === "" ||
            Number.isNaN(
                Number(labelledPrice)
            ) ||
            Number(labelledPrice) < 0
        ) {
            toast.error(
                "Enter a valid labelled price."
            );

            return false;
        }

        if (!category) {
            toast.error(
                "Select a category."
            );

            return false;
        }

        if (!gender) {
            toast.error(
                "Select a gender."
            );

            return false;
        }

        if (!brand.trim()) {
            toast.error(
                "Brand is required."
            );

            return false;
        }

        /*
         * Existing images + new images
         */
        if (
            existingImages.length === 0 &&
            newImages.length === 0
        ) {
            toast.error(
                "Product must have at least one image."
            );

            return false;
        }

        if (variants.length === 0) {
            toast.error(
                "Add at least one product variant."
            );

            return false;
        }

        /*
         * Validate variants.
         */
        for (
            let i = 0;
            i < variants.length;
            i++
        ) {
            const variant = variants[i];

            if (
                !variant.size ||
                !variant.color
            ) {
                toast.error(
                    `Variant ${i + 1} has an invalid size or color.`
                );

                return false;
            }

            if (
                Number.isNaN(
                    Number(variant.stock)
                ) ||
                Number(variant.stock) < 0
            ) {
                toast.error(
                    `Invalid stock in variant ${i + 1}.`
                );

                return false;
            }
        }

        /*
         * Check duplicate SKU values.
         */
        const skuList = variants
            .map((variant) =>
                variant.sku
                    ? variant.sku
                          .trim()
                          .toLowerCase()
                    : ""
            )
            .filter(Boolean);

        const duplicateSku =
            skuList.find(
                (sku, index) =>
                    skuList.indexOf(sku) !==
                    index
            );

        if (duplicateSku) {
            toast.error(
                `Duplicate SKU found: ${duplicateSku}`
            );

            return false;
        }

        return true;
    }

    /*
     * ---------------------------------------------------------
     * UPDATE PRODUCT
     * ---------------------------------------------------------
     */

    async function updateProduct() {
        if (loading) {
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            toast.error(
                "Your session has expired. Please login again."
            );

            navigate("/login");

            return;
        }

        if (!validateProduct()) {
            return;
        }

        try {
            setLoading(true);

            /*
             * -------------------------------------------------
             * IMAGE PROCESSING
             * -------------------------------------------------
             *
             * IMPORTANT:
             * Existing images remain.
             *
             * Only newly selected files are uploaded.
             */

            let uploadedImageUrls = [];

            if (newImages.length > 0) {
                toast.loading(
                    "Uploading new images...",
                    {
                        id: "image-upload",
                    }
                );

                const uploadResults =
                    await Promise.all(
                        newImages.map(
                            async (file) => {
                                try {
                                    return await mediaUpload(
                                        file
                                    );
                                } catch (uploadError) {
                                    console.error(
                                        "Image upload error:",
                                        uploadError
                                    );

                                    throw new Error(
                                        `Failed to upload ${file.name}`
                                    );
                                }
                            }
                        )
                    );

                /*
                 * Validate mediaUpload response.
                 */
                uploadedImageUrls =
                    uploadResults.map(
                        (result) => {
                            /*
                             * Most mediaUpload utilities return
                             * a string URL.
                             *
                             * This also supports common object
                             * response formats.
                             */

                            if (
                                typeof result ===
                                "string"
                            ) {
                                return result;
                            }

                            if (
                                result?.url &&
                                typeof result.url ===
                                    "string"
                            ) {
                                return result.url;
                            }

                            if (
                                result?.secure_url &&
                                typeof result.secure_url ===
                                    "string"
                            ) {
                                return result.secure_url;
                            }

                            if (
                                result?.publicUrl &&
                                typeof result.publicUrl ===
                                    "string"
                            ) {
                                return result.publicUrl;
                            }

                            return null;
                        }
                    );

                const invalidUpload =
                    uploadedImageUrls.some(
                        (url) =>
                            typeof url !==
                                "string" ||
                            !url.trim()
                    );

                if (invalidUpload) {
                    throw new Error(
                        "Image upload returned an invalid URL."
                    );
                }

                toast.success(
                    "Images uploaded successfully.",
                    {
                        id: "image-upload",
                    }
                );
            }

            /*
             * Combine:
             *
             * Existing images that were not removed
             * +
             * newly uploaded images
             */
            const finalImages = [
                ...existingImages,
                ...uploadedImageUrls,
            ];

            if (finalImages.length === 0) {
                throw new Error(
                    "At least one product image is required."
                );
            }

            /*
             * -------------------------------------------------
             * ALT NAMES
             * -------------------------------------------------
             */

            const altNameList =
                altNames
                    .split(",")
                    .map((item) =>
                        item.trim()
                    )
                    .filter(Boolean);

            /*
             * -------------------------------------------------
             * VARIANTS
             * -------------------------------------------------
             */

            const cleanedVariants =
                variants.map(
                    (variant) => {
                        const stock = Math.max(
                            0,
                            Number(
                                variant.stock
                            ) || 0
                        );

                        const cleanedVariant = {
                            size:
                                String(
                                    variant.size
                                ).trim(),

                            color:
                                String(
                                    variant.color
                                ).trim(),

                            stock,

                            isAvailable:
                                stock > 0 &&
                                Boolean(
                                    variant.isAvailable
                                ),
                        };

                        /*
                         * SKU is optional.
                         */
                        if (
                            variant.sku &&
                            String(
                                variant.sku
                            ).trim()
                        ) {
                            cleanedVariant.sku =
                                String(
                                    variant.sku
                                ).trim();
                        }

                        /*
                         * Preserve MongoDB _id for existing
                         * variants.
                         *
                         * New variants will not have _id.
                         */
                        if (
                            variant._id
                        ) {
                            cleanedVariant._id =
                                variant._id;
                        }

                        return cleanedVariant;
                    }
                );

            /*
             * -------------------------------------------------
             * PRODUCT DATA
             * -------------------------------------------------
             */

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
                    finalImages,

                price:
                    Number(price),

                labelledPrice:
                    Number(labelledPrice),

                category,

                gender,

                brand:
                    brand.trim(),

                material:
                    material.trim(),

                variants:
                    cleanedVariants,
            };

            console.log(
                "Updating product:",
                productData
            );

            /*
             * -------------------------------------------------
             * API URL
             * -------------------------------------------------
             */

            const apiUrl =
                import.meta.env.VITE_API_URL;

            if (!apiUrl) {
                throw new Error(
                    "VITE_API_URL is not configured in your .env file."
                );
            }

            /*
             * -------------------------------------------------
             * PUT REQUEST
             * -------------------------------------------------
             *
             * Use the ORIGINAL product ID in the URL.
             *
             * This is important because the backend searches:
             *
             * Product.findOneAndUpdate({
             *     productID: req.params.productID
             * })
             */

            await axios.put(
                `${apiUrl}/api/products/${encodeURIComponent(
                    productID.trim()
                )}`,
                productData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },
                }
            );

            toast.success(
                "Product updated successfully!"
            );

            /*
             * Go back to admin product list.
             */
            navigate(
                "/admin/products"
            );
        } catch (error) {
            console.error(
                "Error updating product:",
                error
            );

            console.error(
                "Server response:",
                error?.response?.data
            );

            /*
             * If token is invalid/expired.
             */
            if (
                error?.response?.status ===
                    401 ||
                error?.response?.status ===
                    403
            ) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                        "You are not authorized. Please login again."
                );

                return;
            }

            /*
             * Duplicate SKU / Product ID.
             */
            if (
                error?.response?.status ===
                409
            ) {
                toast.error(
                    error?.response?.data
                        ?.message ||
                        "Product ID or SKU already exists."
                );

                return;
            }

            const message =
                error?.response?.data
                    ?.message ||
                error?.response?.data
                    ?.error ||
                error?.message ||
                "Error updating product.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    /*
     * ---------------------------------------------------------
     * CALCULATED DATA
     * ---------------------------------------------------------
     */

    const totalStock = useMemo(() => {
        return variants.reduce(
            (total, variant) =>
                total +
                Number(
                    variant.stock || 0
                ),
            0
        );
    }, [variants]);

    const availableVariants =
        useMemo(() => {
            return variants.filter(
                (variant) =>
                    variant.isAvailable &&
                    Number(
                        variant.stock
                    ) > 0
            ).length;
        }, [variants]);

    /*
     * ---------------------------------------------------------
     * NO PRODUCT STATE
     * ---------------------------------------------------------
     */

    if (!product?.productID) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-primary px-5 text-accent">
                <div className="w-full max-w-md rounded-3xl border border-accent/10 bg-white p-8 text-center shadow-xl">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                        <FaTimes />
                    </div>

                    <h1 className="text-xl font-bold">
                        Product Not Found
                    </h1>

                    <p className="mt-2 text-sm text-accent/60">
                        Product information is missing.
                        Please return to the product list
                        and select a product again.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-primary"
                    >
                        <FaArrowLeft />
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * UI
     * ---------------------------------------------------------
     */

    return (
        <div className="min-h-full w-full bg-primary px-4 py-6 text-accent sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* HEADER */}
                <div className="mb-7">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                        disabled={loading}
                        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-accent/15 bg-white/50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-accent transition hover:border-accent/30 hover:bg-white disabled:opacity-50"
                    >
                        <FaArrowLeft />
                        Back to Products
                    </button>

                    <div className="mb-3 flex items-center gap-3">
                        <span className="h-px w-10 bg-accent/40" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent/60">
                            VISCO / ADMIN
                        </span>
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Update Product
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-accent/65">
                        Update product information,
                        images, pricing, sizes,
                        colors and variant-level
                        inventory.
                    </p>
                </div>

                {/* MAIN CARD */}
                <div className="overflow-hidden rounded-[28px] border border-accent/15 bg-white/40 shadow-[0_25px_80px_-35px_rgba(8,6,22,0.35)]">

                    <div className="p-5 sm:p-7 lg:p-9">
                        <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">

                            {/* =====================================================
                                LEFT
                            ====================================================== */}

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
                                            value={
                                                productID
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setProductID(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            disabled
                                        />

                                        <InputField
                                            label="Product Name"
                                            placeholder="Classic Oversized T-Shirt"
                                            value={
                                                name
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setName(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="mt-5">
                                        <InputField
                                            label="Alternative Names"
                                            placeholder="Oversized Tee, Casual Tee"
                                            value={
                                                altNames
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setAltNames(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <p className="mt-1 text-[10px] text-accent/40">
                                            Separate multiple
                                            names with commas.
                                        </p>
                                    </div>

                                    <div className="mt-5">
                                        <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                            Description
                                        </label>

                                        <textarea
                                            rows="6"
                                            placeholder="Describe the fit, style, fabric and important product details..."
                                            value={
                                                description
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setDescription(
                                                    e
                                                        .target
                                                        .value
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
                                            value={
                                                price
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setPrice(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <PriceInput
                                            label="Labelled Price"
                                            value={
                                                labelledPrice
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setLabelledPrice(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    </div>

                                    {Number(
                                        labelledPrice
                                    ) >
                                        Number(
                                            price
                                        ) &&
                                        Number(
                                            price
                                        ) >= 0 && (
                                            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">
                                                Discount:
                                                {" "}
                                                {calculateDiscount(
                                                    labelledPrice,
                                                    price
                                                )}
                                                %
                                            </div>
                                        )}
                                </section>

                                {/* IMAGES */}
                                <section>
                                    <SectionTitle
                                        number="03"
                                        title="Product Images"
                                        description="Manage existing and new product photographs"
                                    />

                                    {/* EXISTING IMAGES */}
                                    {existingImages.length >
                                        0 && (
                                        <div className="mb-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                                    Existing Images
                                                </p>

                                                <span className="text-[10px] text-accent/40">
                                                    {
                                                        existingImages.length
                                                    }{" "}
                                                    saved
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                                {existingImages.map(
                                                    (
                                                        image,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={`${image}-${index}`}
                                                            className="group relative aspect-square overflow-hidden rounded-2xl border border-accent/10 bg-white"
                                                        >
                                                            <img
                                                                src={
                                                                    image
                                                                }
                                                                alt={`Product ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />

                                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">
                                                                    Image{" "}
                                                                    {index +
                                                                        1}
                                                                </span>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeExistingImage(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs text-red-600 shadow-lg transition hover:bg-red-50 disabled:opacity-50"
                                                                title="Remove image"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* UPLOAD */}
                                    <label
                                        htmlFor="product-images"
                                        className="group flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-accent/20 bg-primary/60 p-8 text-center transition hover:border-accent/40 hover:bg-white/50"
                                    >
                                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary shadow-lg transition group-hover:-translate-y-1">
                                            <FaCloudUploadAlt className="text-xl" />
                                        </div>

                                        <p className="text-sm font-bold">
                                            Add New Images
                                        </p>

                                        <p className="mt-1 text-xs text-accent/50">
                                            Existing images will
                                            remain unless removed
                                        </p>

                                        <p className="mt-2 text-[10px] text-accent/40">
                                            JPG, PNG or WEBP •
                                            Maximum 5 MB each
                                        </p>

                                        <input
                                            ref={
                                                fileInputRef
                                            }
                                            id="product-images"
                                            type="file"
                                            multiple
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={
                                                handleImageSelect
                                            }
                                            className="hidden"
                                        />
                                    </label>

                                    {/* NEW IMAGES */}
                                    {newImages.length >
                                        0 && (
                                        <div className="mt-5">
                                            <div className="mb-3 flex items-center justify-between">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                                    New Images
                                                </p>

                                                <span className="text-[10px] text-accent/40">
                                                    {
                                                        newImages.length
                                                    }{" "}
                                                    selected
                                                </span>
                                            </div>

                                            <div className="space-y-2">
                                                {newImages.map(
                                                    (
                                                        image,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={`${image.name}-${image.lastModified}-${index}`}
                                                            className="flex items-center gap-3 rounded-xl border border-accent/10 bg-primary px-3 py-2"
                                                        >
                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                                                                <FaImage className="text-accent/40" />
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-xs font-semibold">
                                                                    {
                                                                        image.name
                                                                    }
                                                                </p>

                                                                <p className="mt-0.5 text-[10px] text-accent/40">
                                                                    {(
                                                                        image.size /
                                                                        1024 /
                                                                        1024
                                                                    ).toFixed(
                                                                        2
                                                                    )}{" "}
                                                                    MB
                                                                </p>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeNewImage(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
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

                                        {/* SIZES */}
                                        <div>
                                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                                Available Sizes
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {sizes.map(
                                                    (
                                                        size
                                                    ) => {
                                                        const active =
                                                            generationSizes.includes(
                                                                size
                                                            );

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    size
                                                                }
                                                                onClick={() =>
                                                                    toggleGenerationSize(
                                                                        size
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className={`h-10 min-w-12 rounded-xl border px-4 text-xs font-bold transition ${
                                                                    active
                                                                        ? "border-accent bg-accent text-primary shadow-md"
                                                                        : "border-accent/15 bg-primary text-accent hover:border-accent/35"
                                                                } disabled:cursor-not-allowed disabled:opacity-50`}
                                                            >
                                                                {size}
                                                            </button>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>

                                        {/* COLORS */}
                                        <div className="mt-7">
                                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-accent/65">
                                                Available Colors
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {colors.map(
                                                    (
                                                        color
                                                    ) => {
                                                        const active =
                                                            generationColors.includes(
                                                                color
                                                            );

                                                        return (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    color
                                                                }
                                                                onClick={() =>
                                                                    toggleGenerationColor(
                                                                        color
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                                                    active
                                                                        ? "border-accent bg-accent text-primary"
                                                                        : "border-accent/15 bg-primary text-accent hover:border-accent/35"
                                                                } disabled:cursor-not-allowed disabled:opacity-50`}
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
                                            onClick={
                                                addVariant
                                            }
                                            disabled={
                                                loading
                                            }
                                            className="mt-7 w-full rounded-xl bg-accent px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Generate Variants
                                        </button>
                                    </div>

                                    {/* VARIANT TABLE */}
                                    {variants.length >
                                        0 && (
                                        <div className="mt-5 overflow-hidden rounded-2xl border border-accent/15">
                                            <div className="flex items-center justify-between bg-accent px-4 py-3 text-primary">
                                                <div>
                                                    <p className="text-xs font-bold">
                                                        Product
                                                        Variants
                                                    </p>

                                                    <p className="mt-0.5 text-[9px] text-primary/60">
                                                        {
                                                            variants.length
                                                        }{" "}
                                                        combinations
                                                    </p>
                                                </div>

                                                <span className="rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold">
                                                    {
                                                        totalStock
                                                    }{" "}
                                                    units
                                                </span>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[850px] text-left">
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

                                                            <th className="px-4 py-3 text-[9px] uppercase tracking-wider">
                                                                Available
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
                                                                    key={
                                                                        variant._id ||
                                                                        `${variant.size}-${variant.color}-${index}`
                                                                    }
                                                                    className="border-t border-accent/10"
                                                                >
                                                                    <td className="px-4 py-3">
                                                                        <span className="inline-flex rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold">
                                                                            {
                                                                                variant.size
                                                                            }
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-4 py-3">
                                                                        <span className="inline-flex rounded-full border border-accent/15 bg-primary px-3 py-1.5 text-xs font-semibold">
                                                                            {
                                                                                variant.color
                                                                            }
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-4 py-3">
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            value={
                                                                                variant.stock
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateVariant(
                                                                                    index,
                                                                                    "stock",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                loading
                                                                            }
                                                                            className="h-10 w-24 rounded-lg border border-accent/15 bg-white px-3 text-sm outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 disabled:bg-gray-100"
                                                                        />
                                                                    </td>

                                                                    <td className="px-4 py-3">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Optional SKU"
                                                                            value={
                                                                                variant.sku ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateVariant(
                                                                                    index,
                                                                                    "sku",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                loading
                                                                            }
                                                                            className="h-10 w-40 rounded-lg border border-accent/15 bg-white px-3 text-sm outline-none focus:border-accent/40 focus:ring-2 focus:ring-accent/10 disabled:bg-gray-100"
                                                                        />
                                                                    </td>

                                                                    <td className="px-4 py-3">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                toggleVariantAvailability(
                                                                                    index
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                loading ||
                                                                                Number(
                                                                                    variant.stock
                                                                                ) <=
                                                                                    0
                                                                            }
                                                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-bold transition ${
                                                                                variant.isAvailable &&
                                                                                Number(
                                                                                    variant.stock
                                                                                ) >
                                                                                    0
                                                                                    ? "bg-green-100 text-green-700"
                                                                                    : "bg-gray-100 text-gray-500"
                                                                            } disabled:cursor-not-allowed disabled:opacity-50`}
                                                                        >
                                                                            {variant.isAvailable &&
                                                                            Number(
                                                                                variant.stock
                                                                            ) >
                                                                                0 ? (
                                                                                <>
                                                                                    <FaCheck />
                                                                                    Available
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FaTimes />
                                                                                    Unavailable
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </td>

                                                                    <td className="px-4 py-3 text-right">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeVariant(
                                                                                    index
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                loading
                                                                            }
                                                                            className="rounded-lg px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
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

                            {/* =====================================================
                                RIGHT
                            ====================================================== */}

                            <div className="space-y-6 xl:col-span-4">

                                {/* CLASSIFICATION */}
                                <section className="rounded-2xl border border-accent/15 bg-primary/70 p-5 sm:p-6">
                                    <SectionTitle
                                        number="05"
                                        title="Classification"
                                        description="Organize your clothing product"
                                    />

                                    <div className="space-y-5">

                                        <SelectField
                                            label="Category"
                                            value={
                                                category
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setCategory(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select
                                                category
                                            </option>

                                            {categories.map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item
                                                        }
                                                        value={
                                                            item
                                                        }
                                                    >
                                                        {
                                                            item
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </SelectField>

                                        <SelectField
                                            label="Gender"
                                            value={
                                                gender
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setGender(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select
                                                gender
                                            </option>

                                            {genders.map(
                                                (
                                                    item
                                                ) => (
                                                    <option
                                                        key={
                                                            item
                                                        }
                                                        value={
                                                            item
                                                        }
                                                    >
                                                        {
                                                            item
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </SelectField>

                                        <InputField
                                            label="Brand"
                                            placeholder="VISCO"
                                            value={
                                                brand
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setBrand(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />

                                        <InputField
                                            label="Material"
                                            placeholder="100% Cotton"
                                            value={
                                                material
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setMaterial(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        />
                                    </div>
                                </section>

                                {/* SUMMARY */}
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
                                            label="Brand"
                                            value={
                                                brand ||
                                                "Not set"
                                            }
                                        />

                                        <SummaryRow
                                            label="Sizes"
                                            value={
                                                generationSizes.length
                                                    ? generationSizes.join(
                                                          ", "
                                                      )
                                                    : "None"
                                            }
                                        />

                                        <SummaryRow
                                            label="Colors"
                                            value={
                                                generationColors.length
                                                    ? generationColors.join(
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
                                            label="Available"
                                            value={
                                                availableVariants
                                            }
                                        />

                                        <SummaryRow
                                            label="Total Stock"
                                            value={
                                                totalStock
                                            }
                                        />

                                        <SummaryRow
                                            label="Saved Images"
                                            value={
                                                existingImages.length
                                            }
                                        />

                                        <SummaryRow
                                            label="New Images"
                                            value={
                                                newImages.length
                                            }
                                        />

                                        <SummaryRow
                                            label="Final Images"
                                            value={
                                                existingImages.length +
                                                newImages.length
                                            }
                                        />
                                    </div>
                                </section>

                                {/* UPDATE NOTE */}
                                <div className="rounded-2xl border border-accent/10 bg-white/60 p-5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/60">
                                        Update Note
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-accent/55">
                                        Existing images are
                                        preserved automatically.
                                        Only images you remove
                                        will be deleted from the
                                        product record. New images
                                        are uploaded only when you
                                        select them.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="border-t border-accent/15 bg-white/20 px-5 py-5 sm:px-7 lg:px-9">
                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                disabled={
                                    loading
                                }
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
                                disabled={
                                    loading
                                }
                                onClick={
                                    updateProduct
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Spinner />
                                        Saving Product...
                                    </>
                                ) : (
                                    <>
                                        Update Product
                                        →
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/*
 * =========================================================
 * SECTION TITLE
 * =========================================================
 */

function SectionTitle({
    number,
    title,
    description,
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

/*
 * =========================================================
 * TEXT INPUT
 * =========================================================
 */

function InputField({
    label,
    placeholder,
    value,
    onChange,
    disabled = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent/70">
                {label}
            </label>

            <input
                type="text"
                placeholder={
                    placeholder
                }
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`h-12 w-full rounded-xl border border-accent/15 px-4 text-sm font-medium text-accent outline-none placeholder:text-accent/35 focus:border-accent/40 focus:ring-4 focus:ring-accent/10 ${
                    disabled
                        ? "cursor-not-allowed bg-accent/5 text-accent/50"
                        : "bg-primary"
                }`}
            />
        </div>
    );
}

/*
 * =========================================================
 * PRICE INPUT
 * =========================================================
 */

function PriceInput({
    label,
    value,
    onChange,
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

/*
 * =========================================================
 * SELECT
 * =========================================================
 */

function SelectField({
    label,
    value,
    onChange,
    children,
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

/*
 * =========================================================
 * SUMMARY ROW
 * =========================================================
 */

function SummaryRow({
    label,
    value,
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="shrink-0 text-[10px] uppercase tracking-wider text-primary/45">
                {label}
            </span>

            <span className="max-w-[65%] truncate text-right text-xs font-medium text-primary/85">
                {value}
            </span>
        </div>
    );
}

/*
 * =========================================================
 * DISCOUNT
 * =========================================================
 */

function calculateDiscount(
    labelledPrice,
    price
) {
    const labelled =
        Number(labelledPrice);

    const selling =
        Number(price);

    if (
        labelled <= 0 ||
        selling < 0 ||
        selling >= labelled
    ) {
        return 0;
    }

    return Math.round(
        ((labelled - selling) /
            labelled) *
            100
    );
}

/*
 * =========================================================
 * LOADING SPINNER
 * =========================================================
 */

function Spinner() {
    return (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
    );
}