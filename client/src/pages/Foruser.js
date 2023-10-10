import Problem from "../components/Problem";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";

function ForUser() {
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
        if (data.status !== "ok") {
          alert("การยืนยันตัวตนผู้ใช้ล้มเหลว");
          localStorage.removeItem("token");
          localStorage.removeItem("role"); // ลบบทบาทถ้าการตรวจสอบล้มเหลว
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  return (
    <div>
      <Sidebar />
      <Problem />
    </div>
  );
}

export default ForUser;
