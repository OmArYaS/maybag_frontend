// auth/loginAction.js

import { redirect } from "react-router";
import { BACKEND_URL } from "./queryfn";

export async function loginAction({ request }) {
  const formData = await request.formData();
  const credentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    return { error: "Invalid email or password" };
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return redirect("/"); // or any protected route
}
