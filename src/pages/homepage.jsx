import React, { useEffect } from "react";
import Header from "../layouts/header";
import Section from "../layouts/section";
import Footer from "../layouts/footer";
import { useLocation } from "react-router";
import Hero from "../layouts/hero";

export default function Homepage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      let id = location.hash.replace("#", "");
      id = id.replace("%20", " ");

      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Section />
      </main>
    </div>
  );
}
