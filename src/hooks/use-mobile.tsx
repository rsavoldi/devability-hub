// src/hooks/use-mobile.tsx
"use client";

import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false); // Default to false on the server

  useEffect(() => {
    // This function runs only on the client side
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check on mount (after hydration)
    checkScreenSize();

    // Add event listener to check on resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return isMobile;
}
