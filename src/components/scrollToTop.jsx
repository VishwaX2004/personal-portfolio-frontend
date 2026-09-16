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

        const element = document.getElementById(sectionId);

        if (element) {
          const headerHeight = 80;

          const elementPosition =
            element.getBoundingClientRect().top +
            window.scrollY;

          window.scrollTo({
            top: elementPosition - headerHeight,
            left: 0,
            behavior: "smooth",
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

    }, 100);

    return () => clearTimeout(timer);

  }, [location.pathname, location.hash]);

  return null;
}