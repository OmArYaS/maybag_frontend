import { Link, Outlet, useLocation } from "react-router";
import { motion } from "framer-motion";

export default function Cart() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

    return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white shadow-lg md:min-h-screen">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Account</h1>
          <nav className="space-y-2 ">
            <Link
              to="/cart/addedproductbyuser"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive("/cart/addedproductbyuser")
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">🛒</span>
              <span className="font-medium">Shopping Cart</span>
            </Link>
            <Link
              to="/cart/userorders"
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                isActive("/cart/userorders")
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">📦</span>
              <span className="font-medium">My Orders</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
