export default function Loading({
  text = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen
          ? "min-h-screen bg-black"
          : "py-16"
      }`}
    >

      <div className="flex flex-col items-center">

        {/* Spinner */}

        <div className="relative w-12 h-12">

          <div className="absolute inset-0 rounded-full border-2 border-white/10" />

          <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />

        </div>


        {/* Text */}

        {text && (
          <p className="text-gray-500 text-sm mt-5">
            {text}
          </p>
        )}

      </div>

    </div>
  );
}