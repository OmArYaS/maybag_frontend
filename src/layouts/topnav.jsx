import React, { useState, useEffect } from "react";
import logo from "../assets/images/logo2.png";
import { NavLink, Outlet } from "react-router";
import DashboardLink from "../components/dashlink";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./footer";

export default function Topnav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const menuItems = [
    { to: "products", label: "Products" },
    { to: "about", label: "About" },
    { to: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="topnav flex justify-between w-full h-[10vh] bg-secondary font-roboto px-4 md:px-8">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i
            className={`fi ${
              isMenuOpen ? "fi-rr-cross" : "fi-rr-menu-burger"
            } text-2xl`}
          ></i>
        </button>

        {/* Desktop Menu */}
        <ul className="topnav__menu hidden md:flex justify-evenly items-center w-1/3 h-full">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `hover:text-primary transition-colors duration-300 ${
                    isActive ? "text-primary" : ""
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <DashboardLink />
        </ul>

        {/* Logo */}
        <div className="topnav__logo flex  justify-center items-center justify-self-center w-1/3 h-full">
          <NavLink to={"/"} className="topnav__logo__img h-full">
            <img src={logo} alt="logo" className="h-full object-contain" />
          </NavLink>
        </div>

        {/* User Actions */}
        <div className="hidden md:flex justify-evenly items-center w-1/3 h-full">
          {/* <NavLink
            to="/wishlist"
            className="hover:text-primary transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <i className="fi fi-rs-heart text-xl"></i>
              <span>Wishlist</span>
            </div>
          </NavLink> */}
          <NavLink
            to="/cart"
            className="hover:text-primary transition-colors duration-300"
          >
            <div className="flex items-center gap-2">
              <i className="fi fi-rs-shopping-bag text-xl"></i>
              <span>Cart</span>
            </div>
          </NavLink>
          {isLoggedIn ? (
            <NavLink
              to="/account"
              className="hover:text-primary transition-colors duration-300"
            >
              <div className="flex items-center gap-2">
                <i className="fi fi-rr-user text-xl"></i>
                <span>Account</span>
              </div>
            </NavLink>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink
                to="/auth/login"
                className="hover:text-primary transition-colors duration-300"
              >
                Login
              </NavLink>
              <NavLink
                to="/auth/signup"
                className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors duration-300"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-secondary"
          >
            <ul className="flex flex-col items-center py-4 space-y-4">
              {menuItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `hover:text-primary transition-colors duration-300 ${
                        isActive ? "text-primary" : ""
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <DashboardLink />
              <div className="flex flex-col items-center space-y-4 pt-4 border-t w-full">
                <NavLink
                  to="/wishlist"
                  className="hover:text-primary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <i className="fi fi-rs-heart text-xl"></i>
                    <span>Wishlist</span>
                  </div>
                </NavLink>
                <NavLink
                  to="/cart"
                  className="hover:text-primary transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <i className="fi fi-rs-shopping-bag text-xl"></i>
                    <span>Cart</span>
                  </div>
                </NavLink>
                {isLoggedIn ? (
                  <NavLink
                    to="/account"
                    className="hover:text-primary transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      <i className="fi fi-rr-user text-xl"></i>
                      <span>Account</span>
                    </div>
                  </NavLink>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <NavLink
                      to="/auth/login"
                      className="hover:text-primary transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/auth/signup"
                      className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </NavLink>
                  </div>
                )}
              </div>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <Outlet />

      <Footer />
    </>
  );
}
