import { motion, AnimatePresence } from "framer-motion";
import { editProductMutationFn } from "../service/mutationFn";

const headers = [
  { key: "image", label: "Image" },
  { key: "name", label: "Name" },
  { key: "brand", label: "Brand" },
  { key: "stock", label: "Stock" },
  { key: "color", label: "Color" },
  { key: "size", label: "Size" },
  { key: "price", label: "Price" },
  { key: "description", label: "Description" },
  { key: "category", label: "Category" },
  { key: "createdAt", label: "Created At" },
  { key: "actions", label: "Actions" },
];

export default function TableControlProducts({
  products,
  isLoading,
  page,
  totalPages,
  setFilters,
  filters,
  setShowEditModal,
  setShowDeleteModal,
}) {
  const handleSort = (key) => {
    if (key === "actions" || key === "image") return;

    setFilters((prev) => ({
      ...prev,
      sort: key,
      order: prev.sort === key && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const renderSortIcon = (key) => {
    if (filters.sort !== key) return null;
    return (
      <span className="ml-1">
        {filters.order === "asc" ? (
          <svg
            className="w-4 h-4 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </span>
    );
  };

  const nextPage = () =>
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));

  const prevPage = () =>
    setFilters((prev) => ({ ...prev, page: prev.page - 1 }));

  return (
    <div>
      <div className="overflow-auto">
        <table className="min-w-[1000px] w-full border-collapse ">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    header.key !== "actions" && header.key !== "image"
                      ? "cursor-pointer hover:bg-gray-100"
                      : ""
                  }`}
                  onClick={() => handleSort(header.key)}
                >
                  <div className="flex items-center">
                    {header.label}
                    {renderSortIcon(header.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {isLoading ? (
                <tr>
                  <td colSpan="11" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        const images =
                          product.images && product.images.length > 0
                            ? product.images
                            : [product.image];
                        const mainImage = images[0];
                        return (
                          <div className="relative w-12 h-12 flex items-center justify-center">
                            <img
                              src={mainImage}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            {/* {images.length > 1 && (
                              <span className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
                                {images.length}
                              </span>
                            )} */}
                            {/* {images.length > 1 && (
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5 bg-white/80 rounded px-1 py-0.5 shadow">
                                {images.slice(0, 3).map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt={product.name + " thumb " + (idx + 1)}
                                    className="w-3 h-3 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )} */}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.brand || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.stock ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.color || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.size || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${product.price}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.category?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setShowEditModal({
                              show: true,
                              id: product._id,
                            })
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setShowDeleteModal({
                              show: true,
                              id: product._id,
                            })
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 my-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={page <= 1}
          onClick={prevPage}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </motion.button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={page >= totalPages}
          onClick={nextPage}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}
