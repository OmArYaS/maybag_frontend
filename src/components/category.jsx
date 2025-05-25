import React from "react";
import Productcard from "./productcard";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategory } from "../service/queryfn";
import { motion } from "framer-motion";

export default function Category({ category, color, name }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", category],
    queryFn: () => getProductsByCategory(category),
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div
        className={`${color} px-20 py-5 w-full flex flex-col items-center gap-4`}
      >
        <div className="animate-pulse w-full">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[50vh] bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${color} px-20 py-5 w-full flex flex-col items-center gap-4`}
      >
        <div className="text-red-500 text-center">
          <i className="fi fi-rr-exclamation text-4xl mb-2"></i>
          <p>Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null; // Don't render empty categories
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      id={name}
      className={`category ${color} px-4 md:px-20 py-5 w-full flex flex-col items-center gap-4`}
    >
      <h1 id="" className="text-3xl font-bold capitalize mb-6">
        {name}
      </h1>
      <div className="category__line relative w-full rounded-lg">
        <Swiper
          modules={[Navigation, Autoplay, Pagination, A11y]}
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            type: "bullets",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          className="w-full pb-12"
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="pb-4"
              >
                <Productcard item={item} />
              </motion.div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination"></div>
          <div className="swiper-button-prev !text-primary hover:!text-primary/80 transition-colors"></div>
          <div className="swiper-button-next !text-primary hover:!text-primary/80 transition-colors"></div>
        </Swiper>
      </div>
    </motion.div>
  );
}
