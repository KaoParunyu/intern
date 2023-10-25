import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Tooltip,
  Legend,
  LinearScale,
  BarElement,
} from "chart.js";
import Axios from "axios";
import { Box, Paper } from "@mui/material";
import { baseUrl } from "../constants/api";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import CheckIcon from "@mui/icons-material/Check";
import MemoryIcon from "@mui/icons-material/Memory";
import PendingIcon from "@mui/icons-material/Pending";
import CampaignIcon from "@mui/icons-material/Campaign";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({});

  const colors = [
    "#071952",
    "#F3E55E",
    "#088395",
    "#36A2EB",
    "#822E81",
    "#AA6373",
    "#CF1259",
    "#B7C3F3",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    Axios.post(`${baseUrl}/authen`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data.status === "ok") {
          if (response.data.decoded.role === "user") {
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

  useEffect(() => {
    Axios.get(`${baseUrl}/dashboard`).then((response) => {
      setData(response.data);
    });
  }, []);

  return (
    <>
      <Sidebar />
      <div className="container py-4">
        {/* <h1 className="fw-semibold fs-2 mb-3">Dashboard</h1> */}
        <Paper
          elevation={20}
          sx={{ p: "80px", borderRadius: "1.5rem", mb: "1.5rem" }}
        >
          <div style={{ marginBottom: "50px" }}>
            <h3 className="fs-4 fw-semibold mb-0">Summary</h3>
          </div>
          <div className="row">
            <div className="col-xl-8">
              <div className="d-flex gap-3">
                <div
                  style={{
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    boxShadow: "0 0 0.5rem #ccc",
                    flex: 1,
                  }}
                  className="col-6"
                >
                  <div className="row h-100 bg-white">
                    <Box
                      sx={{ bgcolor: "#0082E0", borderRadius: "0.5rem" }}
                      className="col-4 d-flex h-100 justify-content-center align-items-center"
                    >
                      <CampaignIcon
                        sx={{
                          width: "4rem",
                          height: "4rem",
                          color: "white",
                          left: "0.5rem",
                          position: "relative",
                        }}
                      />
                    </Box>
                    <div className="col-8 p-3">
                      <h3 style={{ fontSize: "1rem" }}>Total</h3>
                      <p style={{ fontSize: "2rem" }}>
                        {data.totalRepairNotifications}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    boxShadow: "0 0 0.5rem #ccc",
                    flex: 1,
                  }}
                  className="col-6"
                >
                  <div className="row h-100 bg-white">
                    <Box
                      sx={{ bgcolor: "#00C0D1", borderRadius: "0.5rem" }}
                      className="col-4 d-flex h-100 justify-content-center align-items-center"
                    >
                      <PendingIcon
                        sx={{
                          width: "4rem",
                          height: "4rem",
                          color: "white",
                          left: "0.4rem",
                          position: "relative",
                        }}
                      />
                    </Box>
                    <div className="col-8 p-3">
                      <h2 style={{ fontSize: "1rem" }}>New</h2>
                      <p style={{ fontSize: "2rem" }}>
                        {data.totalPendingRepairNotifications}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-3 mt-3">
                <div
                  style={{
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    boxShadow: "0 0 0.5rem #ccc",
                    flex: 1,
                  }}
                  className="col-6"
                >
                  <div className="row h-100 bg-white">
                    <Box
                      sx={{ bgcolor: "#8AE7D4", borderRadius: "0.5rem" }}
                      className="col-4 d-flex h-100 justify-content-center align-items-center"
                    >
                      <MemoryIcon
                        sx={{
                          width: "4rem",
                          height: "4rem",
                          color: "white",
                          left: "0.35rem",
                          position: "relative",
                        }}
                      />
                    </Box>
                    <div className="col-8 p-3">
                      <h2 style={{ fontSize: "1rem" }}>Processing</h2>
                      <p style={{ fontSize: "2rem" }}>
                        {data.totalInProgrssRepairNotifications}
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    boxShadow: "0 0 0.5rem #ccc",
                    flex: 1,
                  }}
                  className="col-6"
                >
                  <div className="row h-100 bg-white">
                    <Box
                      sx={{
                        bgcolor: "#AFD238",
                        borderRadius: "0.5rem",
                      }}
                      className="col-4 d-flex h-100 justify-content-center align-items-center"
                    >
                      <CheckIcon
                        sx={{
                          width: "4rem",
                          height: "4rem",
                          color: "white",
                          left: "0.5rem",
                          position: "relative",
                        }}
                      />
                    </Box>
                    <div className="col-8 p-3">
                      <h2 style={{ fontSize: "1rem" }}>Completed</h2>
                      <p style={{ fontSize: "2rem" }}>
                        {data.totalCompletedRepairNotifications}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 mt-xl-0 col-xl-4">
              <Doughnut
                options={{ maintainAspectRatio: false }}
                data={{
                  labels: ["New", "Processing", "Completed"],
                  datasets: [
                    {
                      data: [
                        data.totalPendingRepairNotifications,
                        data.totalInProgrssRepairNotifications,
                        data.totalCompletedRepairNotifications,
                      ],
                      backgroundColor: ["#00C0D1", "#8AE7D4", "#AFD238"],
                      hoverOffset: 4,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </Paper>
        <Paper
          elevation={20}
          sx={{ p: "80px", borderRadius: "1.5rem", mt: "1.25rem" }}
        >
          <div style={{ marginBottom: "50px" }}>
            {" "}
            <h3 className="fs-4 fw-semibold mb-0">Service Requests by type</h3>
          </div>
          <div>
            {data?.graph && (
              <Bar
                height={400}
                data={{
                  labels: data?.graph?.labels.map(
                    (item) => item[0].toUpperCase() + item.slice(1)
                  ),
                  datasets: Object.keys(data?.graph?.datas).map(
                    (item, index) => ({
                      label: item[0].toUpperCase() + item.slice(1),
                      data: data?.graph?.datas[item],
                      backgroundColor: colors[index],
                    })
                  ),
                }}
                options={{
                  scale: {
                    ticks: {
                      precision: 0,
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Chart.js Bar Chart",
                    },
                  },
                }}
              />
            )}
          </div>
          <div style={{ maxWidth: "400px", marginInline: "auto" }}>
            {data?.total && (
              <Doughnut
                style={{ "margin-bottom": "50px" }}
                data={{
                  labels: Object.keys(data?.graph?.datas).map(
                    (item) => item[0].toUpperCase() + item.slice(1)
                  ),
                  datasets: [
                    {
                      data: Object.values(data.total),
                      hoverOffset: 30,
                      backgroundColor: colors,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: true, // แสดง labels
                      position: "left", // ระบุตำแหน่งของ labels ที่คุณต้องการ
                      labels: {
                        padding: 20, // เพิ่มระยะห่างระหว่าง labels และ datasets
                        margin: 150,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </Paper>
        <Paper
          elevation={20}
          sx={{ p: "80px", borderRadius: "1.5rem", mt: "1.25rem" }}
        >
          <div style={{ marginBottom: "50px" }}>
            {" "}
            <h2 className="mb-3 fs-4 fw-semibold">
              Service Requests by department
            </h2>
          </div>
          <div>
            {data?.graph2 && (
              <Bar
                height={400}
                data={{
                  labels: data?.graph2?.labels.map(
                    (item) => item[0].toUpperCase() + item.slice(1)
                  ),
                  datasets: Object.keys(data?.graph2?.datas).map(
                    (item, index) => ({
                      label: item[0].toUpperCase() + item.slice(1),
                      data: data?.graph2?.datas[item],
                      backgroundColor: colors[index],
                    })
                  ),
                }}
                options={{
                  scale: {
                    ticks: {
                      precision: 0,
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Chart.js Bar Chart",
                    },
                  },
                }}
              />
            )}
          </div>
          {data?.graph2?.datas && (
            <div style={{ maxWidth: "400px", marginInline: "auto" }}>
              <Doughnut
                style={{ "margin-top": "50px", "margin-bottom": "50px" }}
                data={{
                  labels: Object.keys(data.graph2.datas).map(
                    (item) => item[0].toUpperCase() + item.slice(1)
                  ),
                  datasets: [
                    {
                      data: Object.values(data.graph2.datas).map((item) =>
                        item.reduce((a, b) => a + b, 0)
                      ),
                      hoverOffset: 30,
                      backgroundColor: colors,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: true, // แสดง labels
                      position: "left", // ระบุตำแหน่งของ labels ที่คุณต้องการ
                      labels: {
                        padding: 20, // เพิ่มระยะห่างระหว่าง labels และ datasets
                        margin: 150,
                      },
                    },
                  },
                }}
              />
            </div>
          )}
        </Paper>
      </div>
    </>
  );
};

export default Dashboard;
