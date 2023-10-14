import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import RepairForm from "../components/RepairForm";

function ForAdmin() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3333/authen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          if (data.decoded.role === "user") {
            window.location = "/Foruser";
          }
        } else {
          alert("การยืนยันตัวตนแอดมินล้มเหลว");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <Sidebar />
      <RepairForm />
    </>
  );
}

export default ForAdmin;
