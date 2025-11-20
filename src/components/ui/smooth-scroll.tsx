"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface SmoothScrollProps {
  children: React.ReactNode;
  className?: string;
}

export function SmoothScroll({ children, className }: SmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    // Smooth scroll behavior
    element.style.scrollBehavior = "smooth";

    // Add scroll momentum for iOS
    (element.style as any).webkitOverflowScrolling = "touch";

    return () => {
      if (element) {
        element.style.scrollBehavior = "auto";
      }
    };
  }, []);

  return (
    <motion.div
      ref={scrollRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {children}
    </motion.div>
  );
}