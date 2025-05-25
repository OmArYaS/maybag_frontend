import { useNavigate } from "react-router";

export function useAuth() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  return {
    isLoggedIn: !!token,
    token,
    user,
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    },
  };
}
