import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../service/queryfn";
import { useState } from "react";
import { motion } from "framer-motion";
import ControlTopbar from "../components/control_topbar";
import TableControlProducts from "../components/table_control_products";
import AddProductModal from "../components/AddProduct";
import EditProductModal from "../components/editProduct";
import DeleteProductModal from "../components/deleteProduct";

export default function ControlProducts() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "desc",
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    keepPreviousData: true,
  });

  return (
    <div className="space-y-2">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary rounded-xl shadow-lg p-6"
      >
        <ControlTopbar
          filters={filters}
          setFilters={setFilters}
          setShowModal={setShowModal}
        />
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <TableControlProducts
          products={data?.data || []}
          isLoading={isLoading}
          page={data?.page}
          totalPages={data?.totalPages}
          setFilters={setFilters}
          filters={filters}
          setShowEditModal={setShowEditModal}
          setShowDeleteModal={setShowDeleteModal}
        />
      </motion.div>

      {/* Modals */}
      <AddProductModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <EditProductModal
        isOpen={showEditModal.show}
        onClose={() => setShowEditModal(false)}
        id={showEditModal.id}
      />
      <DeleteProductModal
        isOpen={showDeleteModal.show}
        onClose={() => setShowDeleteModal(false)}
        id={showDeleteModal.id}
      />
    </div>
  );
}
