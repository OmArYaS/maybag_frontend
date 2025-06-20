import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { BACKEND_URL } from "./queryfn";
export async function addToCart(
  productId,
  quantity = 1,
  navigate,
  color = null
) {
  const token = localStorage.getItem("token");

  // ✅ لو مفيش توكن، يبقى المستخدم مش عامل تسجيل دخول
  if (!token) {
    toast.error("Please login to add to cart.");
    navigate("/auth/login");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ توكن للباك اند
      },
      body: JSON.stringify({
        productId,
        quantity,
        color,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Something went wrong.");
      throw new Error(data.message || "Something went wrong.");
    } else {
      toast.success("Product added to cart successfully.");
    }
  } catch (err) {
    console.error("Add to cart error:", err);
    alert(err.message);
  }
}
