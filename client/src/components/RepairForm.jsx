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
import Swal from "sweetalert2";
import moment from "moment-timezone";
import ExportReport from "./ExportReport";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import withReactContent from "sweetalert2-react-content";

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

const MySwal = withReactContent(Swal);

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
      const response = await Axios.get(
        "http://localhost:3333/repair_notifications"
      );
      const data = response.data;

      const userIds = data.map((val) => val.user_id);
      const usersResponse = await Axios.get(
        `http://localhost:3333/users?ids=${userIds.join(",")}`
      );
      const users = usersResponse.data;

      const repairTypesResponse = await Axios.get(
        "http://localhost:3333/repair_types"
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
          lastName: val.lname,
          firstName: val.fname,
          problem: val.title,
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
        }
      });
      setRows(newRows);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getStatusOptions = async () => {
    try {
      const response = await Axios.get("http://localhost:3333/status");
      const data = response.data;
      setStatusOptions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getProblem();
    getStatusOptions();
  }, [searchText]);

  const columns = [
    { field: "id", headerName: "Id", width: 50 },
    {
      field: "delete",
      headerName: "Delete",
      width: 75,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => deleteOneProblem(params.row.id)}>
            <DeleteIcon style={{ color:"#071952"}} />
          </IconButton>
        );
      },
    },
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "problem", headerName: "Problem" },
    { field: "repair_type", headerName: "Repair Type" },
    {
      field: "created_at",
      headerName: "Created At",
      width: 150,
      valueGetter: (params) => {
        const thaiTime = moment(params.value)
          .tz("Asia/Bangkok")
          .format("DD/MM/YYYY - HH:mm");
        return thaiTime;
      },
    },
    {
      field: "modified_date",
      headerName: "Modified Date",
      width: 150,
      valueGetter: (params) => {
        const thaiTime = moment(params.value)
          .tz("Asia/Bangkok")
          .format("DD/MM/YYYY - HH:mm");
        return thaiTime;
      },
    },
    {
      field: "status_id",
      width: 200,
      headerName: "Status",
      renderCell: (params) => {
        return (
          <FormControl
            fullWidth
            style={{
              height: "calc(100% - 10px * 2)",
            }}
          >
            <Select
              sx={{ height: "100%" }}
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
      renderCell: (params) => {
        if (!params.value) {
          return <span>-</span>;
        }
        return (
          <Button
            onClick={() => handleOpen(`http://localhost:3333${params.value}`)}
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <img
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "0.5rem",
              }}
              src={`http://localhost:3333${params.value}`}
              alt="preview"
            />
          </Button>
        );
      },
    },
  ];

  const handleSubmit = async () => {
    if (selectedRows.length === 0) {
      MySwal.fire({
        title: "กรุณาเลือกข้อมูลที่ต้องการอัปเดตสถานะ",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    try {
      MySwal.fire({
        title: "คุณต้องการอัปเดตสถานะหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ตกลง",
        cancelButtonText: "ยกเลิก",
      }).then(async (result) => {
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
            await Axios.put(
              `http://localhost:3333/repair_notifications/${statusData.id}`,
              {
                status_id: statusData.status_id,
              }
            );
          }

          // ดึงข้อมูลใหม่
          await getProblem();

          setSelectedRows([]);

          MySwal.fire({
            title: "อัปเดตสถานะเรียบร้อยแล้ว",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteOneProblem = async (id) => {
    MySwal.fire({
      title: "คุณต้องการลบข้อมูลหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await Axios.delete(
          `http://localhost:3333/delete/${id}}`
        );
        if (response.status === 200) {
          console.log("ลบข้อมูลเรียบร้อยแล้ว");
          await getProblem();
        } else {
          console.log("เกิดข้อผิดพลาดในการลบข้อมูล");
        }
        MySwal.fire({
          title: "ลบข้อมูลสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      }
    });
  };

  const deleteProblem = async () => {
    if (selectedRows.length === 0) {
      MySwal.fire({
        title: "กรุณาเลือกข้อมูลที่ต้องการลบ",
        icon: "warning",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    MySwal.fire({
      title: "คุณต้องการลบข้อมูลหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await Axios.delete(
          `http://localhost:3333/delete/${selectedRows.join(",")}`
        );
        if (response.status === 200) {
          console.log("ลบข้อมูลเรียบร้อยแล้ว");
          await getProblem();
        } else {
          console.log("เกิดข้อผิดพลาดในการลบข้อมูล");
        }

        // เคลียร์การเลือก
        setSelectedRows([]);

        MySwal.fire({
          title: "ลบข้อมูลสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      }
    });
  };

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
            <Typography style={{ color:"#071952"}} variant="h6">
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
              <Typography variant="srOnly"style={{ color:"#071952"}}>Close</Typography>
              <span aria-hidden style={{ color:"#071952"}}>×</span>
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
      <h1 className="mb-3 fw-semibold fs-2">Admin</h1>
      <Paper elevation={2} sx={{ p: "1.25rem", borderRadius: "0.5rem" }}>
        <div className="mb-3 d-flex justify-content-between align-items-end">
          <h2 className="fs-4 fw-semibold mb-0">ตารางแจ้งซ่อม</h2>
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
              color: "#071952", // เปลี่ยนสีของ checkbox
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
          <Button variant="outlined" style={{ Color: "#071952", color: "#071952" }} onClick={deleteProblem}>
            Delete
          </Button>
          <Button variant="contained"  style={{ backgroundColor: "#071952", color: "white" }} onClick={handleSubmit}>
            Update Status
          </Button>
        </Box>
      </Paper>
    </div>
  );
}
