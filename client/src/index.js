import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Foruser from "./pages/Foruser";
import Register from "./pages/Register";
import Foradmin from "./pages/Foradmin";
import Dashboard from "./pages/Dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Foradmin" element={<Foradmin />} />
      <Route path="/Foruser" element={<Foruser />} />
      <Route path="/Dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);
