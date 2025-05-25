import { useState } from "react";
import "./App.css";
import Topnav from "./layouts/topnav";
import Homepage from "./pages/homepage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>

      <Homepage />
    </>
  );
}
