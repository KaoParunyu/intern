import {
  Box,
  FormControl,
  IconButton,
  Input,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import Axios from "axios";
import { toast } from "sonner";
import ExportReport from "./ExportReport";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";

import { baseUrl } from "../constants/api";
import { formatDateThaiStyle } from "../common/date-formatter";
import MySwal from "./MySwal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  borderRadius: "0.5rem",
};

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const handleOpen = (image) => {
    setPreviewImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setPreviewImage("");
    setOpen(false);
  };

  const sortedRowsByCreatedAt = [...rows].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return timeB - timeA;
  });

  const getProblem = async () => {
    try {
      const response = await Axios.get(`${baseUrl}/repair_notifications`);
      const data = response.data;

      const usersResponse = await Axios.get(`${baseUrl}/users`);
      const users = usersResponse.data;

      const departmentsResponse = await Axios.get(
        `${baseUrl}/common/departments`
      );
      const departments = departmentsResponse.data;

      const repairTypesResponse = await Axios.get(
        `${baseUrl}/common/repair_types`
      );
      const repairTypesData = repairTypesResponse.data;
      const repairTypesMap = {};
      const statusOptionsMap = {};
      repairTypesData.forEach((repairType) => {
        repairTypesMap[repairType.id] = repairType.name;
      });
      statusOptions.forEach((status) => {
        statusOptionsMap[status.id] = status.name;
      });

      const newRows = data
        .filter((val) => {
          const lowerSearchText = searchText.toLowerCase();
          const user = users.find((user) => user.id === val.user_id); // เปรียบเทียบกับ user_id แทน
          return (
            (val.id && val.id.toString().includes(lowerSearchText)) || // ตรวจสอบว่า val.id มีค่า
            (user.fname.toLowerCase() &&
              user.fname.toLowerCase().includes(lowerSearchText)) || // ตรวจสอบว่า val.fname มีค่า
            (user.lname.toLowerCase() &&
              user.lname.toLowerCase().includes(lowerSearchText)) || // ตรวจสอบว่า val.lname มีค่า
            (val.title.toLowerCase() &&
              val.title.toLowerCase().includes(lowerSearchText)) || // ตรวจสอบว่า val.title มีค่า
            (repairTypesMap[val.repair_type_id] &&
              repairTypesMap[val.repair_type_id]
                .toLowerCase()
                .includes(lowerSearchText)) ||
            (statusOptionsMap[val.status_id] &&
              statusOptionsMap[val.status_id]
                .toLowerCase()
                .includes(lowerSearchText))
          );
        })
        .map((val) => ({
          id: val.id,
          user_id: val.user_id, // เพิ่ม user_id ใน newRows
          departmentId: val.departmentId,
          lastName: val.lname,
          firstName: val.fname,
          problem: val.title,
          department: val.description,
          repair_type_id: val.repair_type_id,
          repair_type: repairTypesMap[val.repair_type_id] || "",
          status_id: val.status_id,
          created_at: val.created_at,
          modified_date: val.modified_date,
          image_url: val.image_url,
        }));
      newRows.forEach((row) => {
        const user = users.find((user) => user.id === row.user_id); // เปรียบเทียบกับ user_id แทน
        if (user) {
          row.lastName = user.lname;
          row.firstName = user.fname;
          row.department = user.departmentId;
        }
        if (user.departmentId) {
          // ค้นหา departmentInfo ที่ตรงกับ user.departmentId
          const departmentInfo = departments.find(
            (dept) => dept.id === user.departmentId
          );
          if (departmentInfo) {
            row.department = departmentInfo.description; // กำหนดค่า description จาก departmentInfo
          }
        }
      });
      setRows(newRows);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStatusOptions = async () => {
    try {
      const response = await Axios.get(`${baseUrl}/common/statuses`);
      const data = response.data;
      setStatusOptions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "Id", width: 1 },
    {
      field: "delete",
      headerName: "Delete",
      width: 60,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => deleteOneProblem(params.row.id)}>
            <DeleteIcon style={{ color: "#0082E0" }} />
          </IconButton>
        );
      },
    },
    { field: "firstName", headerName: "First Name", width: 80 },
    { field: "lastName", headerName: "Last Name", width: 80 },
    { field: "department", headerName: "Department", width: 80 },
    {
      field: "problem",
      headerName: "ServiceDetail",
      width: 290,
      headerAlign: "center",
    },
    { field: "repair_type", headerName: "ServiceType ", width: 80 },
    {
      field: "created_at",
      headerName: "CreateDate",
      width: 120,
      valueGetter: (params) => formatDateThaiStyle(params.value),
    },
    {
      field: "modified_date",
      headerName: "ModifyDate",
      width: 120,
      valueGetter: (params) => formatDateThaiStyle(params.value),
    },
    {
      field: "status_id",
      width: 160,
      headerName: "Status",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <FormControl
            fullWidth
            style={{
              height: "calc(100% - 10px * 2)",
              alignItems: "center", // จัดให้ตัวเลือก Select อยู่ตรงกลาง
            }}
          >
            <Select
              sx={{ height: "100%", width: "120px" }}
              value={selectedStatus[params.row.id] || params.value}
              onChange={(e) => {
                setSelectedStatus({
                  ...selectedStatus,
                  [params.row.id]: e.target.value,
                });
              }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: "image_url",
      headerName: "Image",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (!params.value) {
          return <span>-</span>;
        }
        return (
          <Button
            onClick={() => handleOpen(`${baseUrl}${params.value}`)}
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "0.5rem",
              }}
              src={`${baseUrl}${params.value}`}
              alt="preview"
            />
          </Button>
        );
      },
    },
  ];

  const handleSubmit = async () => {
    if (selectedRows.length === 0) {
      await MySwal.fire({
        // title: "กรุณาเลือกข้อมูลที่ต้องการอัปเดตสถานะ",
        title: "Please select data to update status.",
        icon: "warning",
      });
      return;
    }

    try {
      const result = await MySwal.fire({
        // title: "คุณต้องการอัปเดตสถานะหรือไม่?",
        title: "Do you want to update this status?",
        icon: "warning",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        // สร้างอาร์เรย์ของสถานะที่มีการเปลี่ยนแปลง
        const updatedStatus = [];
        for (const selectedRow of selectedRows) {
          if (selectedRow in selectedStatus) {
            const newStatusId = selectedStatus[selectedRow];
            updatedStatus.push({
              id: selectedRow,
              status_id: newStatusId,
            });
          }
        }

        // ส่งข้อมูลการอัปเดตไปยัง API หรือฐานข้อมูล
        for (const statusData of updatedStatus) {
          await Axios.put(`${baseUrl}/repair_notifications/${statusData.id}`, {
            status_id: statusData.status_id,
          });
        }

        // ดึงข้อมูลใหม่
        await getProblem();

        setSelectedRows([]);

        await MySwal.fire({
          title: "Update Status Success",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteOneProblem = async (id) => {
    console.log(id);
    const result = await MySwal.fire({
      title: "Do you want to delete this data?",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      const response = await Axios.delete(
        `${baseUrl}/repair_notifications/${id}`
      );

      if (response.status === 200) {
        await getProblem();
      }

      await MySwal.fire({
        title: "Delete Success",
        icon: "success",
      });
    }
  };

  const deleteProblem = async () => {
    if (selectedRows.length === 0) {
      await MySwal.fire({
        title: "Please select data to delete.",
        icon: "warning",
      });
      return;
    }

    const result = await MySwal.fire({
      title: "Do you want to delete this data?",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      const response = await Axios.delete(
        `${baseUrl}/repair_notifications/${selectedRows.join(",")}`
      );

      if (response.status === 200) {
        await getProblem();
      }

      // เคลียร์การเลือก
      setSelectedRows([]);

      await MySwal.fire({
        title: "Delete Success",
        icon: "success",
      });
    }
  };

  useEffect(() => {
    getProblem();
    getStatusOptions();
  }, [searchText]);

  return (
    <div className="container py-4">
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "1rem",
            }}
          >
            <Typography style={{ color: "#071952" }} variant="h6">
              Preview
            </Typography>
            <IconButton
              color="primary"
              sx={{
                width: "3rem",
                height: "3rem",
              }}
              onClick={handleClose}
            >
              <Typography variant="srOnly" style={{ color: "#071952" }}>
                Close
              </Typography>
              <span aria-hidden style={{ color: "#071952" }}>
                ×
              </span>
            </IconButton>
          </Box>
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "0.5rem",
            }}
            src={previewImage}
            alt="preview"
          />
        </Box>
      </Modal>
      {/* <h1 className="mb-3 fw-semibold fs-2">Administator</h1> */}
      <Paper
        Paper
        elevation={20}
        sx={{ p: "80px", borderRadius: "1.5rem", mt: "1.25rem" }}
      >
        <div className="mb-3 d-flex justify-content-between align-items-end">
          {/* <h2 className="fs-4 fw-semibold mb-0">ตารางแจ้งซ่อม</h2> */}
          <h2 className="fs-4 fw-semibold mb-0">Service Info</h2>
          <ExportReport />
        </div>
        <Input
          sx={{ mb: "1rem", width: "100%" }}
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <DataGrid
          rows={sortedRowsByCreatedAt}
          columns={columns}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          sx={{
            "& .MuiDataGrid-checkboxInput": {
              color: "#0082E0", // เปลี่ยนสีของ checkbox
            },
            "& p": {
              mb: 0,
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            mt: "1rem",
          }}
        >
          <Button
            variant="outlined"
            style={{ Color: "#8AE7D4", color: "#0082E0" }}
            onClick={deleteProblem}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            style={{ backgroundColor: "#0082E0", color: "white" }}
            onClick={handleSubmit}
          >
            Update Status
          </Button>
          <IconButton
            variant="contained"
            style={{ color: "#0082E0" }}
            onClick={() => {
              toast.success("Refresh Success");
              getProblem();
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Paper>
    </div>
  );
}
