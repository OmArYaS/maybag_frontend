import { useEffect, useState } from "react";
import { NavLink } from "react-router";

function DashboardLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user?.role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }
  }, []);

  return isAdmin ? <NavLink to="dashboard">Dashboard</NavLink> : null;
}

export default DashboardLink;