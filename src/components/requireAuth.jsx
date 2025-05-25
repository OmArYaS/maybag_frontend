// components/RequireAuth.jsx
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function RequireAuth() {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Outlet /> : <Navigate to="/auth/login" />;
}
