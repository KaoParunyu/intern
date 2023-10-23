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
          // alert("การยืนยันตัวตนแอดมินล้มเหลว");
          alert("Authentication failed");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    (async () => {
      const response = await Axios.get(`${baseUrl}/dashboard`);
      setData(response.data);
    })();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="container py-4">
        {/* <h1 className="fw-semibold fs-2 mb-3">Dashboard</h1> */}
        <Paper
          elevation={2}
          sx={{ p: "1.25rem", borderRadius: "0.5rem", mb: "1.25rem" }}
        >
          <h2 className="mb-3 fs-4 fw-semibold">Summary</h2>
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
                      sx={{ bgcolor: "#36A2EB", borderRadius: "0.5rem" }}
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
                      <h2 style={{ fontSize: "1rem" }}>Total</h2>
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
                      sx={{ bgcolor: "#071952", borderRadius: "0.5rem" }}
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
                      sx={{ bgcolor: "#F3E55E", borderRadius: "0.5rem" }}
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
                        bgcolor: "#088395",
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
                      backgroundColor: ["#071952", "#F3E55E", "#088395"],
                      hoverOffset: 4,
                    },
                  ],
                }}
              />
            </div>
          </div>
        </Paper>
        <Paper elevation={2} sx={{ p: "1.25rem", borderRadius: "0.5rem" }}>
          <h2 className="mb-3 fs-4 fw-semibold">
            จำนวนรายการแจ้งซ่อมตามประเภท
          </h2>
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
                data={{
                  labels: Object.keys(data?.graph?.datas).map(
                    (item) => item[0].toUpperCase() + item.slice(1)
                  ),
                  datasets: [
                    {
                      data: Object.values(data.total),
                      hoverOffset: 4,
                      backgroundColor: colors,
                    },
                  ],
                }}
              />
            )}
          </div>
        </Paper>
        <Paper
          elevation={2}
          sx={{ p: "1.25rem", borderRadius: "0.5rem", mt: "1.25rem" }}
        >
          <h2 className="mb-3 fs-4 fw-semibold">จำนวนรายการแจ้งซ่อมตามแผนก</h2>
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
                data={{
                  labels: Object.keys(data.graph2.datas).map(
                    (item) => item[0].toUpperCase() + item.slice(1)
                  ),
                  datasets: [
                    {
                      data: Object.values(data.graph2.datas).map((item) =>
                        item.reduce((a, b) => a + b, 0)
                      ),
                      hoverOffset: 4,
                      backgroundColor: colors,
                    },
                  ],
                }}
              />
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default Dashboard;
