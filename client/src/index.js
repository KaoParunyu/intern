import "./index.css";
import React from "react";
import { Toaster } from "sonner";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Foruser from "./pages/Foruser";
import Register from "./pages/Register";
import Foradmin from "./pages/Foradmin";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "@emotion/react";
import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Prompt", "sans - serif"].join(","),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={responsiveFontSizes(theme)}>
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Foradmin" element={<Foradmin />} />
        <Route path="/Foruser" element={<Foruser />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
