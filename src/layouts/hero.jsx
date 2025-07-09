import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../service/queryfn.js";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function Hero() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: () => fetchProducts({ limit: 5 }),
    onError: (error) => {
      toast.error("Failed to load featured products");
    },
  });

  const products = data?.data || [];

  if (isLoading) {
    return (
      <div className="w-[90vw] h-[50vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !products.length) {
    return (
      <div className="w-[90vw] h-[50vh] flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Featured Products
          </h2>
          <p className="text-gray-600">
            Please check back later for our featured items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-auto w-[90vw] h-[50vh] flex justify-center items-center p-9 relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, A11y]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {products.map((item) => (
          <SwiperSlide key={item._id}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center w-full h-[40vh] bg-white/10 backdrop-blur-sm rounded-2xl p-8"
            >
              <div className="flex flex-col justify-center items-start w-1/2 h-[40vh] mr-10 space-y-4">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-bold text-gray-800"
                >
                  {item.name}
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-gray-600 line-clamp-2"
                >
                  {item.description}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-2xl font-bold text-primary">
                   <span className="font-roboto">EGP</span> {item.price}
                  </span>
                  <Link
                    to={`/product/${item._id}`}
                    className="bg-primary text-white rounded-xl px-6 py-2 hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </Link>
                </motion.div>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-1/2 h-[40vh] flex items-center justify-center relative"
              >
                {(() => {
                  const images =
                    item.images && item.images.length > 0
                      ? item.images
                      : [item.image];
                  const mainImage = images[0];
                  return (
                    <>
                      <img
                        src={mainImage.url}
                        alt={item.name}
                        className="max-h-full max-w-full object-cover  rounded-lg shadow-xl"
                      />
                      
                      {images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-white/70 rounded-md px-2 py-1 shadow">
                          {images.slice(0, 4).map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url}
                              alt={item.name + " thumb " + (idx + 1)}
                              className="w-6 h-6 object-cover rounded"
                            />
                          ))}
                          {images.length > 4 && (
                            <span className="ml-1 text-xs text-gray-600">
                              +{images.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="control absolute top-3/4 right-0 flex justify-between items-center z-10 gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="custom-prev bg-white/80 hover:bg-white flex justify-center items-center text-lg rounded-full w-10 h-10 shadow-lg transition-colors"
        >
          <i className="fi fi-rr-arrow-small-left"></i>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="custom-next bg-primary hover:bg-primary/90 flex justify-center items-center text-lg rounded-full w-10 h-10 shadow-lg transition-colors"
        >
          <i className="fi fi-rr-arrow-right"></i>
        </motion.button>
      </div>
    </div>
  );
}
