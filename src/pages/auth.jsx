import React from "react";
import { Outlet } from "react-router";
import { motion } from "framer-motion";

export default function Auth() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-primary">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-7xl mx-auto"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
