import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrders } from "../service/queryfn";
import { useAuth } from "../hooks/useAuth";
import { deleteOrder, updateOrderStatus } from "../service/mutationFn";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { generatePDF } from "../service/generatePDF";

const ProductList = ({ products }) => {
  return (
    <div className="space-y-2">
      {products.map((item) => (
        <div
          key={item._id}
          className="flex items-center gap-2 p-2 bg-white/50 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          {item.productId ? (
            <>
              <div className="w-12 h-12 relative">
                <img
                  src={item.productId.image}
                  alt={item.productId.name}
                  className="w-12 h-12 object-cover rounded-md border border-gray-100"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "flex";
                  }}
                />
                <div className="w-12 h-12 hidden items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                  <i className="fi fi-rr-box text-gray-400"></i>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.productId.name}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="font-medium">${item.productId.price}</span>
                  <span>×</span>
                  <span className="font-medium">{item.quantity}</span>
                  <span>=</span>
                  <span className="font-medium text-blue-600">
                    ${(item.productId.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                <i className="fi fi-rr-box text-gray-400"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 truncate">
                  Product Deleted
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <span>Quantity: {item.quantity}</span>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default function Orders() {
  const { token } = useAuth();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("orderDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "orders",
      search,
      sortKey,
      sortOrder,
      page,
      statusFilter,
      dateRange,
    ],
    queryFn: () =>
      fetchOrders({
        token,
        search,
        sortKey,
        sortOrder,
        page,
        status: statusFilter,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      }),
    keepPreviousData: true,
    retry: 1,
    onError: (error) => {
      toast.error(error.message || "Failed to fetch orders");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) =>
      updateOrderStatus(orderId, status, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (orderId) => deleteOrder(orderId, token),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      toast.success("Order deleted successfully");
      setSelectedOrder(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete order");
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    statusMutation.mutate({ orderId, status: newStatus });
  };

  const handleDelete = (order) => {
    setSelectedOrder(order);
  };

  const confirmDelete = () => {
    if (selectedOrder) {
      deleteMutation.mutate(selectedOrder._id);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
      Preparing: "bg-blue-50 text-blue-700 hover:bg-blue-100",
      Shipped: "bg-purple-50 text-purple-700 hover:bg-purple-100",
      Delivered: "bg-green-50 text-green-700 hover:bg-green-100",
      Cancelled: "bg-red-50 text-red-700 hover:bg-red-100",
    };
    return colors[status] || "bg-gray-50 text-gray-700 hover:bg-gray-100";
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDateRange({ startDate: "", endDate: "" });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by ID or Email"
              className="w-72 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() =>
              generatePDF(data, search, statusFilter, dateRange, token)
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="fi fi-rr-file-pdf text-lg"></i>
            Export PDF
          </motion.button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error.message}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("totalAmount")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Total</span>
                    {sortKey === "totalAmount" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort("orderDate")}
                    className="flex items-center space-x-1 hover:text-gray-700"
                  >
                    <span>Date</span>
                    {sortKey === "orderDate" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              <AnimatePresence>
                {!isLoading && data?.data?.length > 0 ? (
                  data.data.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`group transition-all duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-l-4 border-transparent group-hover:border-blue-500">
                        {order._id.slice(-6)}
                      </td>
                      <td className="px-4 py-4">
                        <ProductList products={order.products} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.userId?.username}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.userId?.phone}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.userId?.age}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.userId?.address}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        ${order.totalAmount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )} border-0 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(order)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : isLoading ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-12 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td
                      colSpan="10"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {data?.totalPages || 1}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page === data?.totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this order? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
