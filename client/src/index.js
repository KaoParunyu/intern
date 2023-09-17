import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import Problem from './Problem';
import Tabletest from './Tabletest';
import Register from './Register';
import RepairForm from './RepairForm';
import RepairList from './RepairList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/Problem" element={<Problem />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/Tabletest" element={<Tabletest />} />
    <Route path="/Register" element={<Register />} />
    <Route path="/RepairForm" element={<RepairForm />} />
    <Route path="/RepairList" element={<RepairList />} />
  </Routes>
    
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
