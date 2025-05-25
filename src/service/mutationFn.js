import { BACKEND_URL } from "./queryfn";

export const createProductMutationFn = async ({ formData, token }) => {
  const res = await fetch(`${BACKEND_URL}/api/products/add`, {
    method: "POST",
    body: formData,
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
};
export const editProductMutationFn = async ({ id, formData, token }) => {
  const res = await fetch(`${BACKEND_URL}/api/products/update/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const deleteProductMutationFn = async ({ id, token }) => {
  const res = await fetch(`${BACKEND_URL}/api/products/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    // ارمي الخطأ ومعاه الرسالة الحقيقية
    throw new Error(data.message || "Failed to delete product");
  }

  return data; // فيه { message: "..."}
};

export const updateOrderStatus = async (orderId, status, token) => {
  const res = await fetch(`${BACKEND_URL}/api/order/update/${orderId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};

export const deleteOrder = async (orderId, token) => {
  const res = await fetch(`${BACKEND_URL}/api/order/delete/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete order");
  return res.json();
};
