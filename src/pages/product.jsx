import { useState, useEffect } from "react";
import { useLoaderData, useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { BACKEND_URL } from "../service/queryfn";
export default function Product() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const data = useLoaderData();
  const [quantity, setQuantity] = useState(1);
  const images =
    data.images && data.images.length > 0 ? data.images : [data.image];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedColor, setSelectedColor] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      if (!token) {
        navigate("/auth/login");
        throw new Error("Please login to add items to cart");
      }

      const response = await fetch(`${BACKEND_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity, color: selectedColor }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add to cart");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error) => {
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    },
  });

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(data.stock, value));
    setQuantity(newQuantity);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Set default color if available
  useEffect(() => {
    if (
      data.color &&
      Array.isArray(data.color) &&
      data.color.length > 0 &&
      !selectedColor
    ) {
      setSelectedColor(data.color[0]);
    }
  }, [data.color, selectedColor]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="flex flex-col items-center gap-4">
              {/* Main Image */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg"
              >
                <img
                  src={selectedImage}
                  alt={data.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
                {data.stock <= 5 && data.stock > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Only {data.stock} left!
                  </div>
                )}
                {data.stock === 0 && (
                  <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </div>
                )}
              </motion.div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-2 justify-center">
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(image)}
                      className={`rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === image
                          ? "border-primary ring-2 ring-primary"
                          : "border-gray-200"
                      }`}
                      style={{ width: 60, height: 60 }}
                    >
                      <img
                        src={image}
                        alt={`${data.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold text-gray-900"
                >
                  {data.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-2 text-2xl font-bold text-blue-600"
                >
                  ${data.price}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-sm text-gray-500"
              >
                <p>{data.description}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {data.color &&
                  Array.isArray(data.color) &&
                  data.color.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-gray-600 font-medium">
                        Select Color:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {data.color.map((color) => (
                          <motion.button
                            key={color}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleColorSelect(color)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                              selectedColor === color
                                ? "border-primary bg-primary text-white"
                                : "border-gray-300 hover:border-primary"
                            }`}
                          >
                            {color}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                {data.brand && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 font-medium">Brand:</span>
                    <span className="text-gray-900">{data.brand}</span>
                  </div>
                )}
                {data.size && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 font-medium">Size:</span>
                    <span className="text-gray-900">{data.size}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 font-medium">
                    Availability:
                  </span>
                  <span
                    className={`font-medium ${
                      data.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {data.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </motion.div>

              {/* Add to Cart Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={data.stock}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value))
                      }
                      className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= data.stock}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      addToCartMutation.mutate({
                        productId: data._id,
                        quantity,
                      })
                    }
                    disabled={
                      addToCartMutation.isPending ||
                      data.stock === 0 ||
                      (data.color && data.color.length > 0 && !selectedColor)
                    }
                    className={`flex-1 px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                      data.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {addToCartMutation.isPending ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Adding to Cart...
                      </span>
                    ) : data.color &&
                      data.color.length > 0 &&
                      !selectedColor ? (
                      "Select Color First"
                    ) : (
                      "Add to Cart"
                    )}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                    >
                      <strong className="font-bold">Success!</strong>
                      <span className="block sm:inline">
                        {" "}
                        Product added to cart.
                      </span>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    >
                      <strong className="font-bold">Error!</strong>
                      <span className="block sm:inline"> {error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/*
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
*/
