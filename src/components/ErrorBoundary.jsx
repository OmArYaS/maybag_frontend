import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      setHasError(true);
      setError(error);
      setErrorInfo(errorInfo);
      console.error("Error caught by boundary:", error, errorInfo);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e4d1d4] to-[#caa0a2] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white/30 backdrop-blur-lg rounded-3xl p-8 shadow-xl"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              ⚠️
            </motion.div>
            <h1 className="text-3xl font-bold text-[#caa0a2]">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-700">
              We apologize for the inconvenience. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="bg-[#caa0a2] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                Refresh Page
              </motion.button>
              <div className="text-sm text-gray-600">
                Error ID: {error?.message?.slice(0, 8) || "Unknown"}
              </div>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 p-4 bg-white/20 rounded-lg text-left overflow-auto max-h-60">
                <pre className="text-sm text-gray-700">
                  {error && error.toString()}
                  {"\n"}
                  {errorInfo && errorInfo.componentStack}
                </pre>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ErrorBoundary;
