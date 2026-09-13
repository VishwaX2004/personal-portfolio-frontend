import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Give React time to render the destination page
    const timer = setTimeout(() => {
      // =====================================================
      // HASH / SECTION NAVIGATION
      // =====================================================

      if (location.hash) {
        const sectionId = decodeURIComponent(
          location.hash.substring(1)
        );

        const element =
          document.getElementById(sectionId);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          return;
        }
      }

      // =====================================================
      // NORMAL PAGE NAVIGATION
      // =====================================================

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return null;
}