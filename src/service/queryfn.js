export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export async function getCategory() {
  const res = await fetch(`${BACKEND_URL}/api/categories`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Category not found");
    } else if (res.status >= 500) {
      throw new Error("Server error, please try again later");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
  const data = await res.json();
  // Return the single category object
  return data;
}

export async function getProductsByCategory(categoryId) {
  const res = await fetch(
    `${BACKEND_URL}/api/categories/${categoryId}/products`
  );
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Category not found");
    } else if (res.status >= 500) {
      throw new Error("Server error, please try again later");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
  const data = await res.json();
  return data;
}

// api/products.js
export async function fetchProducts({
  page = 1,
  limit = 10,
  sort = "createdAt",
  order = "desc",
  category = "",
  name = "",
  minPrice = "",
  maxPrice = "",
}) {
  const params = new URLSearchParams();

  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (sort) params.append("sort", sort);
  if (order) params.append("order", order);
  if (category) params.append("category", category);
  if (name) params.append("name", name);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);

  const res = await fetch(`${BACKEND_URL}/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
}

export const fetchOrders = async ({
  token,
  search,
  sortKey,
  sortOrder,
  page,
  status,
  startDate,
  endDate,
}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (sortKey) params.append("sort", sortKey);
  if (sortOrder) params.append("order", sortOrder);
  if (page) params.append("page", page);
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  params.append("limit", 10);

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/order/all/users?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch orders");
    }

    return res.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch orders");
  }
};
