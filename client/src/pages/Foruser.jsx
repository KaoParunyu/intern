import Axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { baseUrl } from "../constants/api";
import Problem from "../components/Problem";
import Sidebar from "../components/Sidebar";

function ForUser() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    Axios.post(`${baseUrl}/auth/verify-token`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data.status === "ok") {
          if (response.data.decoded.role !== "user") {
            navigate("/Foruser");
          }
        } else {
          // alert("การยืนยันตัวตนแอดมินล้มเหลว");
          alert("Authentication failed");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [navigate]);

  return (
    <>
      <Sidebar />
      <Problem />
    </>
  );
}

export default ForUser;
