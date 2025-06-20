import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { useState } from "react";
import { BACKEND_URL } from "../service/queryfn";

export default function UserOrders() {
  const { token } = useAuth();
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  // Fetch user's orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ["userOrders", statusFilter, dateRange],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_URL}/api/order/all/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      // Apply filters
      const filteredOrders = data.filter((order) => {
        const matchesStatus = !statusFilter || order.status === statusFilter;
        const orderDate = new Date(order.orderDate);
        const matchesStartDate =
          !dateRange.startDate || orderDate >= new Date(dateRange.startDate);
        const matchesEndDate =
          !dateRange.endDate || orderDate <= new Date(dateRange.endDate);
        return matchesStatus && matchesStartDate && matchesEndDate;
      });

      return filteredOrders;
    },
  });

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Preparing: "bg-blue-100 text-blue-800",
      Shipped: "bg-purple-100 text-purple-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: "⏳",
      Preparing: "👨‍🍳",
      Shipped: "📦",
      Delivered: "✅",
      Cancelled: "❌",
    };
    return icons[status] || "❓";
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setStatusFilter("");
    setDateRange({ startDate: "", endDate: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary rounded-2xl shadow-xl p-6 md:p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Orders
            </h1>
            <Link
              to="/products"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2"
            >
              <span>Continue Shopping</span>
              <span>→</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </motion.button>
            </div>
          </div>

          {!orders?.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🛍️</div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                No Orders Found
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {statusFilter || dateRange.startDate || dateRange.endDate
                  ? "No orders match your current filters."
                  : "Your order history will appear here once you make a purchase."}
              </p>
              {statusFilter || dateRange.startDate || dateRange.endDate ? (
                <button
                  onClick={clearFilters}
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Clear Filters
                </button>
              ) : (
                <Link
                  to="/products"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Start Shopping
                </Link>
              )}
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <p className="text-gray-600">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.products.map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center space-x-4 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {(() => {
                            const images =
                              item.productId.images &&
                              item.productId.images.length > 0
                                ? item.productId.images
                                : [item.productId.image];
                            const mainImage = images[0];
                            return (
                              <div className="relative w-16 h-16 flex items-center justify-center">
                                <img
                                  src={mainImage}
                                  alt={item.productId.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                />
                                {/* {images.length > 1 && (
                                  <span className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded-full z-10">
                                    {images.length}
                                  </span>
                                )} */}
                                {images.length > 1 && (
                                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5 bg-white/80 rounded px-1 py-0.5 shadow">
                                    {images.slice(0, 3).map((img, idx) => (
                                      <img
                                        key={idx}
                                        src={img}
                                        alt={
                                          item.productId.name +
                                          " thumb " +
                                          (idx + 1)
                                        }
                                        className="w-3 h-3 object-cover rounded"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">
                              {item.productId.name}
                            </h4>
                            <div className="flex flex-wrap gap-4 mt-1">
                              <p className="text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-gray-600">
                                Price: ${item.productId.price}
                              </p>
                              {item.color && (
                                <p className="text-gray-600">
                                  Color:{" "}
                                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                                    {item.color}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">
                              $
                              {(item.quantity * item.productId.price).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Items:</span>
                        <span className="font-medium text-gray-800">
                          {order.products.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-lg font-medium text-gray-800">
                          Total Amount:
                        </span>
                        <span className="text-xl font-bold text-blue-600">
                          ${order.totalAmount}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
