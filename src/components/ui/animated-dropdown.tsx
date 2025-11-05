"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { forwardRef } from "react";

interface AnimatedDropdownContentProps extends React.ComponentProps<typeof DropdownMenuContent> {
  children: React.ReactNode;
}

export const AnimatedDropdownContent = forwardRef<
  React.ElementRef<typeof DropdownMenuContent>,
  AnimatedDropdownContentProps
>(({ children, ...props }, ref) => {
  return (
    <DropdownMenuContent ref={ref} asChild {...props}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </DropdownMenuContent>
  );
});

AnimatedDropdownContent.displayName = "AnimatedDropdownContent";