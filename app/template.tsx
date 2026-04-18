"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <motion.div
      initial={isLoginPage ? { opacity: 0, scale: 0.95, filter: "blur(10px)" } : { opacity: 0, y: 10 }}
      animate={isLoginPage ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 1, y: 0 }}
      transition={
        isLoginPage
          ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // Smooth, Apple-like slow ease
          : { duration: 0.4, ease: "easeOut" }
      }
    >
      {children}
    </motion.div>
  );
}
