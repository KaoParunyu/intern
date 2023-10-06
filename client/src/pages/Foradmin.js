import Sidebar from "../components/Sidebar";
import { useEffect } from "react";
import RepairForm from "../components/RepairForm";
import Navbar from "react-bootstrap/Navbar";

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
          localStorage.removeItem("token");
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
      <Navbar />
      <RepairForm />
    </>
  );
}

export default ForAdmin;
