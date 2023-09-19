import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import Problem from './Problem';
import Tabletest from './Tabletest';
import Register from './Register';
import RepairForm from './RepairForm';
import RepairList from './RepairList';
import Foradmin from './Foradmin';
import Sidebar from './Sidebar';
import Foruser from './Foruser';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/Problem" element={<Problem />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/Tabletest" element={<Tabletest />} />
    <Route path="/Register" element={<Register />} />
    <Route path="/RepairForm" element={<RepairForm />} />
    <Route path="/RepairList" element={<RepairList />} />
    <Route path="/Foradmin" element={<Foradmin />} />
    <Route path="/Foradmin" element={<Foradmin />} />
    <Route path="/Sidebar" element={<Sidebar />} />
    <Route path="/Foruser" element={<Foruser />} />

  </Routes>
    
  </BrowserRouter>
);


reportWebVitals();
