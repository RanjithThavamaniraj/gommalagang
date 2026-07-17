"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type FadeUpProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
