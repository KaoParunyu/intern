import "./index.css";
import React from "react";
import Login from "./pages/Login";
import Foruser from "./pages/Foruser";
import Register from "./pages/Register";
import ReactDOM from "react-dom/client";
import Foradmin from "./pages/Foradmin";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Foradmin" element={<Foradmin />} />
      <Route path="/Foruser" element={<Foruser />} />
    </Routes>
  </BrowserRouter>
);
