import axios from "axios"
import { useState, useRef } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function login() {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/login`,
                {
                    email: email,
                    password: password,
                }
            )

            toast.success("Login successful!")

            localStorage.setItem("token", response.data.token)

            const user = response.data.user;

            if (user.role === "admin") {
                navigate("/admin")
            } else {
                navigate("/")
            }

        } catch (error) {
            console.error("Login error:", error)
            toast.error("Login failed. Please check your credentials and try again.")
        }
    }

    // --- Presentational-only state ---
    const [showPassword, setShowPassword] = useState(false)
    const [spot, setSpot] = useState({ x: 50, y: 50 })
    const [btnTilt, setBtnTilt] = useState({ x: 0, y: 0 })
    const stageRef = useRef(null)

    function handleStageMove(e) {
        if (!stageRef.current) return

        const rect = stageRef.current.getBoundingClientRect()

        setSpot({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        })
    }

    function handleBtnMove(e) {
        const rect = e.currentTarget.getBoundingClientRect()

        const relX =
            (e.clientX - rect.left - rect.width / 2) /
            (rect.width / 2)

        const relY =
            (e.clientY - rect.top - rect.height / 2) /
            (rect.height / 2)

        setBtnTilt({
            x: relX * 5,
            y: relY * 4,
        })
    }

    return (
        <div className="min-h-screen w-full overflow-hidden bg-accent text-primary">

            {/* =====================================================
                ANIMATIONS
            ====================================================== */}
            <style>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideRight {
                    from {
                        opacity: 0;
                        transform: translateX(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideLeft {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(.88);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-18px) rotate(3deg);
                    }
                }

                @keyframes floatReverse {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(14px) rotate(-4deg);
                    }
                }

                @keyframes marquee {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-50%);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }

                @keyframes rotateSlow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes pulseSoft {
                    0%, 100% {
                        opacity: .25;
                        transform: scale(1);
                    }
                    50% {
                        opacity: .5;
                        transform: scale(1.08);
                    }
                }

                .visco-fade-up {
                    animation: fadeUp .9s cubic-bezier(.16,1,.3,1) both;
                }

                .visco-fade-in {
                    animation: fadeIn 1s ease-out both;
                }

                .visco-slide-right {
                    animation: slideRight 1s cubic-bezier(.16,1,.3,1) both;
                }

                .visco-slide-left {
                    animation: slideLeft 1s cubic-bezier(.16,1,.3,1) both;
                }

                .visco-scale {
                    animation: scaleIn 1s cubic-bezier(.16,1,.3,1) both;
                }

                .visco-float {
                    animation: float 7s ease-in-out infinite;
                }

                .visco-float-reverse {
                    animation: floatReverse 9s ease-in-out infinite;
                }

                .visco-marquee {
                    animation: marquee 28s linear infinite;
                }

                .visco-shimmer {
                    background-size: 200% auto;
                    animation: shimmer 5s linear infinite;
                }

                .visco-rotate {
                    animation: rotateSlow 25s linear infinite;
                }

                .visco-pulse {
                    animation: pulseSoft 5s ease-in-out infinite;
                }

                /* Floating label */
                .visco-input:focus ~ .visco-label,
                .visco-input:not(:placeholder-shown) ~ .visco-label {
                    transform: translateY(-25px) scale(.72);
                    color: #FAF3E1;
                    letter-spacing: .15em;
                }

                .visco-input:focus ~ .visco-line {
                    transform: scaleX(1);
                }

                /* Button */
                .visco-login-button {
                    background-size: 200% 100%;
                    background-position: 0% center;
                    transition:
                        background-position .6s ease,
                        transform .15s ease,
                        box-shadow .4s ease;
                }

                .visco-login-button:hover {
                    background-position: 100% center;
                    box-shadow:
                        0 18px 45px -12px rgba(250,243,225,.35);
                }

                /* Input autofill */
                input:-webkit-autofill,
                input:-webkit-autofill:hover,
                input:-webkit-autofill:focus {
                    -webkit-text-fill-color: #FAF3E1;
                    -webkit-box-shadow: 0 0 0px 1000px #080616 inset;
                    transition: background-color 5000s ease-in-out 0s;
                }

                @media (prefers-reduced-motion: reduce) {
                    *,
                    *::before,
                    *::after {
                        animation-duration: .01ms !important;
                        animation-iteration-count: 1 !important;
                        transition-duration: .01ms !important;
                    }
                }
            `}</style>

            {/* =====================================================
                TOP FASHION MARQUEE
            ====================================================== */}
            <div className="relative z-50 h-9 w-full overflow-hidden border-b border-primary/10 bg-primary text-accent">
                <div className="visco-marquee flex h-full w-max items-center">

                    {[0, 1].map((item) => (
                        <div
                            key={item}
                            className="flex h-full shrink-0 items-center"
                        >
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center whitespace-nowrap px-5 text-[9px] font-medium uppercase tracking-[.28em]"
                                >
                                    <span>VISCO CLOTHING</span>

                                    <span className="mx-5 text-accent/40">
                                        /
                                    </span>

                                    <span>NEW SEASON</span>

                                    <span className="mx-5 text-accent/40">
                                        /
                                    </span>

                                    <span>EST. 2024</span>

                                    <span className="mx-5 text-accent/40">
                                        /
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}

                </div>
            </div>

            {/* =====================================================
                MAIN
            ====================================================== */}
            <main
                ref={stageRef}
                onMouseMove={handleStageMove}
                className="relative flex h-full w-full items-center overflow-hidden mt-7"
            >

                {/* =================================================
                    BACKGROUND LIGHT
                ================================================== */}

                <div
                    className="pointer-events-none absolute inset-0 opacity-70 transition-all duration-500"
                    style={{
                        background: `
                            radial-gradient(
                                500px circle at ${spot.x}% ${spot.y}%,
                                rgba(250,243,225,.07),
                                transparent 65%
                            )
                        `,
                    }}
                />

                {/* Large glow */}
                <div
                    className="visco-pulse pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-3xl"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(250,243,225,.12), transparent 68%)",
                    }}
                />

                <div
                    className="visco-pulse pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl"
                    style={{
                        animationDelay: "2s",
                        background:
                            "radial-gradient(circle, rgba(250,243,225,.09), transparent 68%)",
                    }}
                />

                {/* =================================================
                    FABRIC GRID
                ================================================== */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[.035]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(250,243,225,.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(250,243,225,.8) 1px, transparent 1px)
                        `,
                        backgroundSize: "42px 42px",
                    }}
                />

                {/* =================================================
                    DECORATIVE CIRCLES
                ================================================== */}

                <div className="visco-rotate pointer-events-none absolute right-[8%] top-[12%] hidden h-28 w-28 rounded-full border border-primary/10 lg:block">
                    <div className="absolute inset-3 rounded-full border border-dashed border-primary/10" />
                </div>

                <div className="visco-float pointer-events-none absolute bottom-[15%] left-[42%] hidden h-20 w-20 rounded-full border border-primary/10 lg:block" />

                <div className="pointer-events-none absolute left-[48%] top-[22%] hidden h-1.5 w-1.5 rounded-full bg-primary/50 lg:block" />

                <div className="pointer-events-none absolute right-[34%] bottom-[20%] hidden h-1 w-1 rounded-full bg-primary/50 lg:block" />

                {/* =================================================
                    CONTENT WRAPPER
                ================================================== */}
                <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_440px] lg:gap-20">

                    {/* =================================================
                        LEFT BRAND AREA
                    ================================================== */}
                    <section className="visco-slide-right hidden lg:block">

                        {/* Small label */}
                        <div
                            className="mb-8 flex items-center gap-4"
                            style={{ animationDelay: ".1s" }}
                        >
                            <span className="h-px w-12 bg-primary/30" />

                            <span className="text-[10px] uppercase tracking-[.4em] text-primary/45">
                                Contemporary Clothing
                            </span>
                        </div>

                        {/* Logo */}
                        <div className="mb-10">

                            <img
                                src="/logo.png"
                                alt="VISCO Clothing"
                                className="visco-scale h-auto w-[220px] object-contain object-left"
                                style={{
                                    animationDelay: ".25s",
                                }}
                            />

                        </div>

                        {/* Main heading */}
                        <h1 className="max-w-2xl text-5xl font-light leading-[.95] tracking-[-.045em] text-primary xl:text-7xl">
                            <span className="visco-fade-up block">
                                Dress
                            </span>

                            <span
                                className="visco-fade-up block italic text-primary/50"
                                style={{
                                    animationDelay: ".1s",
                                }}
                            >
                                your
                            </span>

                            <span
                                className="visco-fade-up block"
                                style={{
                                    animationDelay: ".2s",
                                }}
                            >
                                identity.
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className="visco-fade-up mt-8 max-w-md text-sm leading-7 text-primary/45"
                            style={{
                                animationDelay: ".4s",
                            }}
                        >
                            Discover thoughtfully designed pieces made
                            for everyday movement, modern expression,
                            and effortless confidence.
                        </p>

                        {/* Bottom details */}
                        <div
                            className="visco-fade-up mt-12 flex items-center gap-8"
                            style={{
                                animationDelay: ".55s",
                            }}
                        >

                            <div>
                                <p className="text-[9px] uppercase tracking-[.3em] text-primary/30">
                                    Collection
                                </p>

                                <p className="mt-2 text-xs tracking-wide text-primary/70">
                                    01 / 04
                                </p>
                            </div>

                            <div className="h-8 w-px bg-primary/10" />

                            <div>
                                <p className="text-[9px] uppercase tracking-[.3em] text-primary/30">
                                    Philosophy
                                </p>

                                <p className="mt-2 text-xs tracking-wide text-primary/70">
                                    Less. Better. Yours.
                                </p>
                            </div>

                        </div>

                        {/* Decorative thread */}
                        <div className="mt-14 flex items-center gap-4">
                            <span className="h-px w-32 bg-gradient-to-r from-primary/30 to-transparent" />

                            <span className="text-[8px] tracking-[.5em] text-primary/25">
                                VISCO ATELIER
                            </span>
                        </div>

                    </section>

                    {/* =================================================
                        MOBILE BRAND
                    ================================================== */}
                    <div className="visco-fade-in flex flex-col items-center text-center lg:hidden">

                        <img
                            src="/logo.png"
                            alt="VISCO Clothing"
                            className="mb-7 h-auto w-[150px] object-contain"
                        />

                        <p className="max-w-sm text-sm leading-6 text-primary/45">
                            Thoughtfully designed clothing for
                            modern everyday living.
                        </p>

                    </div>

                    {/* =================================================
                        LOGIN CARD
                    ================================================== */}
                    <section
                        className="visco-slide-left relative w-full"
                        style={{
                            animationDelay: ".2s",
                        }}
                    >

                        {/* Card glow */}
                        <div className="pointer-events-none absolute -inset-5 rounded-[40px] bg-primary/[.025] blur-2xl" />

                        <div className="relative overflow-hidden rounded-[30px] border border-primary/[.12] bg-primary/[.035] p-7 shadow-[0_35px_100px_-30px_rgba(0,0,0,.7)] backdrop-blur-2xl sm:p-9 md:p-11">

                            {/* Top shine */}
                            <div
                                className="pointer-events-none absolute left-0 right-0 top-0 h-px"
                                style={{
                                    background:
                                        "linear-gradient(90deg, transparent, rgba(250,243,225,.35), transparent)",
                                }}
                            />

                            {/* Card decorative corner */}
                            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-primary/[.05]" />

                            <div className="relative">

                                {/* Card heading */}
                                <div className="mb-10">

                                    <div className="mb-5 flex items-center gap-3">
                                        <span className="h-px w-7 bg-primary/40" />

                                        <span className="text-[9px] uppercase tracking-[.4em] text-primary/40">
                                            Member Access
                                        </span>
                                    </div>

                                    <h2 className="text-3xl font-light tracking-[-.03em] text-primary sm:text-4xl">
                                        Welcome back.
                                    </h2>

                                    <p className="mt-3 text-xs leading-5 text-primary/40">
                                        Sign in to continue your VISCO journey.
                                    </p>

                                </div>

                                {/* =================================================
                                    FORM
                                ================================================== */}
                                <div className="flex flex-col gap-8">

                                    {/* Email */}
                                    <div className="relative pt-4">

                                        <input
                                            id="email"
                                            type="email"
                                            placeholder=" "
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="visco-input peer w-full border-0 border-b border-primary/15 bg-transparent pb-3 text-sm text-primary outline-none transition-colors duration-300 placeholder-transparent focus:border-transparent"
                                            autoComplete="email"
                                        />

                                        <label
                                            htmlFor="email"
                                            className="visco-label pointer-events-none absolute left-0 top-4 origin-left text-[12px] uppercase tracking-[.1em] text-primary/35 transition-all duration-300 ease-out"
                                        >
                                            Email address
                                        </label>

                                        <span className="visco-line absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-500" />

                                    </div>

                                    {/* Password */}
                                    <div className="relative pt-4">

                                        <input
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder=" "
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="visco-input peer w-full border-0 border-b border-primary/15 bg-transparent pb-3 pr-14 text-sm text-primary outline-none transition-colors duration-300 placeholder-transparent focus:border-transparent"
                                            autoComplete="current-password"
                                        />

                                        <label
                                            htmlFor="password"
                                            className="visco-label pointer-events-none absolute left-0 top-4 origin-left text-[12px] uppercase tracking-[.1em] text-primary/35 transition-all duration-300 ease-out"
                                        >
                                            Password
                                        </label>

                                        <span className="visco-line absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-500" />

                                        {/* Show password */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            className="absolute bottom-2 right-0 text-[9px] uppercase tracking-[.18em] text-primary/30 transition-colors hover:text-primary/70"
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword
                                                ? "Hide"
                                                : "Show"}
                                        </button>

                                    </div>

                                    {/* Forgot password */}
                                    <div className="-mt-2 flex justify-end">

                                        <button
                                            type="button"
                                            className="text-[10px] uppercase tracking-[.15em] text-primary/35 transition-colors hover:text-primary"
                                        >
                                            Forgot password?
                                        </button>

                                    </div>

                                    {/* Login button */}
                                    <button
                                        onClick={login}
                                        onMouseMove={handleBtnMove}
                                        onMouseLeave={() =>
                                            setBtnTilt({
                                                x: 0,
                                                y: 0,
                                            })
                                        }
                                        className="visco-login-button relative mt-1 h-14 w-full overflow-hidden rounded-full bg-primary text-[10px] font-medium uppercase tracking-[.3em] text-accent shadow-[0_12px_35px_-12px_rgba(250,243,225,.35)]"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(110deg, #FAF3E1 0%, #FAF3E1 45%, rgba(250,243,225,.72) 60%, #FAF3E1 100%)",
                                            transform: `translate(${btnTilt.x}px, ${btnTilt.y}px)`,
                                        }}
                                    >
                                        <span className="relative z-10">
                                            Sign In
                                        </span>
                                    </button>

                                    {/* Divider */}
                                    <div className="flex items-center gap-4">

                                        <span className="h-px flex-1 bg-primary/[.08]" />

                                        <span className="text-[8px] uppercase tracking-[.25em] text-primary/20">
                                            or
                                        </span>

                                        <span className="h-px flex-1 bg-primary/[.08]" />

                                    </div>

                                    {/* Create account */}
                                    <p className="text-center text-xs text-primary/35">

                                        New to Visco?

                                        <button
                                            type="button"
                                            className="ml-2 text-primary/75 underline decoration-primary/20 underline-offset-4 transition-colors hover:text-primary"
                                        >
                                            Create an account
                                        </button>

                                    </p>

                                </div>

                                {/* Bottom branding */}
                                <div className="mt-10 flex items-center justify-between border-t border-primary/[.07] pt-5">

                                    <span className="text-[8px] uppercase tracking-[.3em] text-primary/20">
                                        VISCO CLOTHING
                                    </span>

                                    <span className="text-[8px] uppercase tracking-[.3em] text-primary/20">
                                        EST. 2024
                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>

                </div>

                {/* =================================================
                    PAGE FOOTER
                ================================================== */}
                <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex">

                    <span className="h-px w-8 bg-primary/10" />

                    <span className="text-[8px] uppercase tracking-[.4em] text-primary/20">
                        Crafted for everyday expression
                    </span>

                    <span className="h-px w-8 bg-primary/10" />

                </div>

            </main>
        </div>
    )
}