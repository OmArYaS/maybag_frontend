import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../service/queryfn";
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${BACKEND_URL}/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();

      // Handle both array and single object responses
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === "object") {
        // If it's a single category object, wrap it in an array
        return [data];
      } else {
        console.error("Invalid categories data format:", data);
        return [];
      }
    },
  });
}
