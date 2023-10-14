import { ExplicitOutlined } from "@material-ui/icons";
import { Button } from "@mui/material";
import Axios from "axios";
import { downloadExcel } from "react-export-table-to-excel";

const ExportReport = () => {
  const moment = require("moment-timezone");

  const handleDownloadExcel = async () => {
    const response = await Axios.get(
      "http://localhost:3333/repair_notifications/current-month"
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
  };

  return (
    <Button variant="contained" color="success" onClick={handleDownloadExcel}>
      Export Excel
    </Button>
  );
};

export default ExportReport;
