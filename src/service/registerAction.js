// auth/registerAction.js

import { redirect } from "react-router";
import { BACKEND_URL } from "./queryfn";

export async function registerAction({ request }) {
  const formData = await request.formData();

  const userData = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    age: formData.get("age"),
    address: formData.get("address"),
    phone: formData.get("phone"),
  };

  const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    return { error: error.message || "Registration failed" };
  }

  const data = await res.json();

  // Optionally log in directly after registration
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  return redirect("/");
}
