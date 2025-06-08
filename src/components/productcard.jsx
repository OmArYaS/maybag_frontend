import { NavLink, useNavigate } from "react-router";
import { addToCart } from "../service/addcart.js";
import { motion } from "framer-motion";

export default function Productcard({ item }) {
  const navigate = useNavigate();
  const isOutOfStock = item.stock <= 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="productcard flex flex-col justify-between bg-white h-[30vh] md:h-[40vh] rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 relative"
    >
      {isOutOfStock && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
          Out of Stock
        </div>
      )}
      <NavLink
        to={`/product/${item._id}`}
        className="flex flex-col justify-between h-[80%] p-4"
      >
        <div className="relative h-[50%] overflow-hidden rounded-lg">
          <img
            className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-300"
            src={item.image}
            alt={item.title}
          />
        </div>
        <div className="productcard__desc p-3 flex flex-col justify-between items-center">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{item.name}</p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-xl font-bold text-primary">${item.price}</p>
          </div>
        </div>
      </NavLink>
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={isOutOfStock}
        className={`${
          isOutOfStock
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-primary hover:bg-primary/90"
        } text-white h-[10%] mb-4 rounded-full p-2 text-sm font-medium mx-4 transition-colors duration-300 flex items-center justify-center gap-2`}
        onClick={() => !isOutOfStock && addToCart(item._id, 1, navigate)}
      >
        <i className="fi fi-rr-shopping-cart"></i>
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </motion.button>
    </motion.div>
  );
}
