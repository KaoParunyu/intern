import Axios from "axios";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Tooltip,
  Legend,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

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

  useEffect(() => {
    (async () => {
      const response = await Axios.get("http://localhost:3333/dashboard");
      setData(response.data);
    })();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="container">
        <h1 style={{ marginTop: "1rem" }}>Dashboard</h1>
        <h2>รายการแจ้งซ่อม</h2>
        <div className="row">
          <div className="col-8">
            <div className="row gap-3">
              <div
                style={{
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  boxShadow: "0 0 0.5rem #ccc",
                }}
                className="col"
              >
                <div className="row bg-white p-2">
                  <Box
                    sx={{ bgcolor: "#36A2EB", borderRadius: "0.5rem" }}
                    className="col-4 d-flex justify-content-center align-items-center"
                  >
                    <CampaignIcon
                      sx={{ width: "4rem", height: "4rem", color: "white" }}
                    />
                  </Box>
                  <div className="col-8 p-3">
                    <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      ทั้งหมด
                    </h2>
                    <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
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
                }}
                className="col"
              >
                <div className="row bg-white p-2">
                  <Box
                    sx={{ bgcolor: "#FF6384", borderRadius: "0.5rem" }}
                    className="col-4 d-flex justify-content-center align-items-center"
                  >
                    <CampaignIcon
                      sx={{ width: "4rem", height: "4rem", color: "white" }}
                    />
                  </Box>
                  <div className="col-8 p-3">
                    <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      รอดำเนินการ
                    </h2>
                    <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      {data.totalPendingRepairNotifications}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row gap-3 mt-3">
              <div
                style={{
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  boxShadow: "0 0 0.5rem #ccc",
                }}
                className="col"
              >
                <div className="row bg-white p-2">
                  <Box
                    sx={{ bgcolor: "#FFCE56", borderRadius: "0.5rem" }}
                    className="col-4 d-flex justify-content-center align-items-center"
                  >
                    <CampaignIcon
                      sx={{ width: "4rem", height: "4rem", color: "white" }}
                    />
                  </Box>
                  <div className="col-8 p-3">
                    <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      กำลังดำเนินการ
                    </h2>
                    <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
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
                }}
                className="col"
              >
                <div className="row bg-white p-2">
                  <Box
                    sx={{ bgcolor: "#77dd77", borderRadius: "0.5rem" }}
                    className="col-4 d-flex justify-content-center align-items-center"
                  >
                    <CampaignIcon
                      sx={{ width: "4rem", height: "4rem", color: "white" }}
                    />
                  </Box>
                  <div className="col-8 p-3">
                    <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      เสร็จสมบูรณ์
                    </h2>
                    <p style={{ fontSize: "1rem", fontWeight: "bold" }}>
                      {data.totalCompletedRepairNotifications}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <Doughnut
              options={{ maintainAspectRatio: false }}
              data={{
                labels: ["รอดำเนินการ", "กำลังดำเนินการ", "เสร็จสมบูรณ์"],
                datasets: [
                  {
                    data: [
                      data.totalPendingRepairNotifications,
                      data.totalInProgrssRepairNotifications,
                      data.totalCompletedRepairNotifications,
                    ],
                    backgroundColor: ["#FF6384", "#FFCE56", "#77dd77"],
                    hoverOffset: 4,
                  },
                ],
              }}
            />
          </div>
        </div>
        <div className="mt-5">
          <Bar
            height={400}
            data={{
              labels: data?.graph?.labels.map(
                (item) => item[0].toUpperCase() + item.slice(1)
              ),
              datasets: [
                {
                  backgroundColor: "#FF6384",
                  label: "Computer",
                  data: data?.graph?.datas.computer,
                },
                {
                  backgroundColor: "#36A2EB",
                  label: "Printer",
                  data: data?.graph?.datas.printer,
                },
                {
                  backgroundColor: "#FFCE56",
                  label: "Internet",
                  data: data?.graph?.datas.internet,
                },
              ],
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
