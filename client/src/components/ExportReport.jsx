import Axios from "axios";
import { toast } from "sonner";
import { Button } from "@mui/material";
import { downloadExcel } from "react-export-table-to-excel";
import { baseUrl } from "../constants/api";

const ExportReport = () => {
  const moment = require("moment-timezone");

  const handleDownloadExcel = async () => {
    const response = await Axios.get(
      `${baseUrl}/repair_notifications/current-month`
    );
    console.log(response.data);
    const header = [
      "Id",
      "First Name",
      "Last Name",
      "Title",
      "Repair Type",
      "Status",
      "Created At",
      "Modified Date At",
    ];
    const body = [
      ...response.data.map((val) => [
        val.repairNotificationId,
        val.firstName,
        val.lastName,
        val.title,
        val.repairTypeName,
        val.statusName,
        moment(val.createdAt).tz("Asia/Bangkok").format("DD/MM/YYYY - HH:mm"),
        moment(val.modifiedDate)
          .tz("Asia/Bangkok")
          .format("DD/MM/YYYY - HH:mm"),
      ]),
    ];
    downloadExcel({
      fileName: "repair-notifications",
      sheet: "Repair Notifications",
      tablePayload: {
        header,
        body,
      },
    });
    toast.success("Export Excel Success");
  };

  return (
    <Button variant="outlined" color="success" onClick={handleDownloadExcel}>
      Export Excel
    </Button>
  );
};

export default ExportReport;
