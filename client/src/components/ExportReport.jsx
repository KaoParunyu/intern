import Axios from "axios";
import { toast } from "sonner";
import { Button } from "@mui/material";
import { downloadExcel } from "react-export-table-to-excel";

import { baseUrl } from "../constants/api";
import { formatDateThaiStyle } from "../common/date-formatter";

const ExportReport = () => {
  const handleDownloadExcel = async () => {
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
    const response = await Axios.get(
      `${baseUrl}/repair_notifications/current-month`
    );
    const body = response.data.map(
      ({
        repairNotificationId,
        firstName,
        lastName,
        title,
        repairTypeName,
        statusName,
        createdAt,
        modifiedDate,
      }) => [
        repairNotificationId,
        firstName,
        lastName,
        title,
        repairTypeName,
        statusName,
        formatDateThaiStyle(createdAt),
        formatDateThaiStyle(modifiedDate),
      ]
    );
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
    <Button
      endIcon={<img width={16} height={16} src="/excel.svg" alt="excel" />}
      variant="outlined"
      color="success"
      onClick={handleDownloadExcel}
    >
      Export
    </Button>
  );
};

export default ExportReport;
