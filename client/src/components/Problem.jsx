import {
  Box,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Axios from "axios";
import { toast } from "sonner";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect, useCallback } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import MySwal from "./MySwal";
import ExportReport from "./ExportReport";
import { baseUrl } from "../constants/api";
import { formatDateThaiStyle } from "../common/date-formatter";

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

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Form = () => {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [repair_type, setRepair_type] = useState("");
  const [repairTypes, setRepairTypes] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [problemList, setProblemlist] = useState([]);
  const [file, setFile] = useState();
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

  const getMe = async () => {
    try {
      const { data } = await Axios.get(`${baseUrl}/users/me`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setUserId(data.id);
      setFirstName(data.fname);
      setLastName(data.lname);
      setRole(data.role);
      setDepartment(data.department);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getProblem = useCallback(async () => {
    try {
      const repairTypesResponse = await Axios.get(
        `${baseUrl}/common/repair_types`
      );
      const repairTypesData = repairTypesResponse.data;
      setRepairTypes(repairTypesData);

      const statusTypesResponse = await Axios.get(`${baseUrl}/common/statuses`);
      const statusTypesData = statusTypesResponse.data;
      setStatusTypes(statusTypesData);

      const response = await Axios.get(`${baseUrl}/repair_notifications`);
      // เรียกข้อมูล user จาก API ตามค่า user_id ในแต่ละรายการ
      const usersResponse = await Axios.get(`${baseUrl}/users`);
      const users = usersResponse.data;
      // รวมข้อมูล fname และ lname เข้ากับแต่ละแถวของ problemList
      const updatedProblemList = response.data.map((problem) => {
        const user = users.find((user) => user.id === problem.user_id);
        return {
          ...problem,
          fname: user ? user.fname : "",
          lname: user ? user.lname : "",
        };
      });
      const sortedProblemList = [...updatedProblemList];
      sortedProblemList.sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeB - timeA;
      });
      const filteredAndSortedRows = sortedProblemList.filter(
        (row) => row.user_id === userId
      );
      setProblemlist(filteredAndSortedRows);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [userId]);

  const postProblem = async (e) => {
    e.preventDefault();

    if (!title && !repair_type) {
      await MySwal.fire({
        // title: "กรุณากรอก Title และเลือก Repair Type",
        title: "Please enter Title and select Repair Type",
        icon: "error",
      });
      return;
    }

    if (!title) {
      await MySwal.fire({
        // title: "กรุณากรอก Title",
        title: "Please enter Title",
        icon: "error",
      });
      return;
    }

    if (!repair_type) {
      await MySwal.fire({
        // title: "กรุณาเลือก Repair Type",
        title: "Please select Repair Type",
        icon: "error",
      });
      return;
    }

    const result = await MySwal.fire({
      // title: "คุณต้องการแจ้งปัญหาหรือไม่?",
      title: "Do you want to report a problem?",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      let imagePath = "";

      if (file) {
        const formData = new FormData();
        formData.append("image", file);
        const response = await Axios.post(`${baseUrl}/images`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        imagePath = response.data;
      }

      try {
        await Axios.post(
          `${baseUrl}/repair_notifications`,
          {
            title: title,
            repair_type_id: repair_type,
            image_url: imagePath,
          },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        // toast.success("แจ้งปัญหาสำเร็จ");
        toast.success("Report a problem successfully");
        getProblem();
        setTitle("");
        setRepair_type("");
        setFile(null);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleResetForm = async () => {
    const result = await MySwal.fire({
      // title: "คุณต้องการรีเซ็ตฟอร์มหรือไม่?",
      title: "Do you want to reset the form?",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      setTitle("");
      setRepair_type("");
      setFile(null);
      // toast.success("รีเซ็ตฟอร์มสำเร็จ");
      toast.success("Reset form successfully");
    }
  };

  useEffect(() => {
    getMe().then(() => getProblem());
  }, [getProblem]);

  const columns = [
    {
      field: "id",
      headerName: "Ticket Id",
      width: 90,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "Service Detail",
      width: 550,
      headerAlign: "center",
    },
    {
      field: "repair_type_id",
      headerName: "Repair Type",
      width: 100,
      valueGetter: (params) => {
        const repairType = repairTypes.find((type) => type.id === params.value);
        return repairType?.name || "";
      },
    },
    {
      field: "status_id",
      headerName: "Status",
      width: 100,
      valueGetter: (params) => {
        const statusType = statusTypes.find((type) => type.id === params.value);
        return statusType?.name || "";
      },
    },
    {
      field: "created_at",
      headerName: "Created Date",
      width: 150,
      valueGetter: (params) => formatDateThaiStyle(params.value),
    },
    {
      field: "modified_date",
      headerName: "Modified Date",
      width: 150,
      valueGetter: (params) => formatDateThaiStyle(params.value),
    },
    {
      field: "image_url",
      headerName: "Image",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return !params.value ? (
          <span style={{ textAlign: "center" }}>-</span>
        ) : (
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
            <Typography color="primary" variant="h6">
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
              <Typography variant="srOnly">Close</Typography>
              <span aria-hidden>×</span>
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
      {/* <h1 className="mb-3 fw-semibold fs-2">User</h1> */}
      <Paper
        elevation={20}
        sx={{ p: "80px", borderRadius: "1.5rem", mt: "1.25rem" }}
      >
        <h2 className="mb-3 fs-4 fw-semibold">SERVICE REQUEST</h2>
        <form onSubmit={postProblem} className="form">
          <div className="row">
            <div className="col">
              <FormControl fullWidth className="form-group">
                <label className="mb-2" htmlFor="firstName">
                  First Name
                </label>
                <TextField
                  fullWidth
                  placeholder="First Name"
                  id="firstName"
                  name="firstName"
                  disabled
                  value={firstName}
                />
              </FormControl>
            </div>
            <div className="col">
              <FormControl fullWidth className="form-group">
                <label className="mb-2" htmlFor="lastName">
                  Last Name
                </label>
                <TextField
                  fullWidth
                  placeholder="Last Name"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  disabled
                />
              </FormControl>
            </div>
            <div className="col">
              <FormControl fullWidth className="form-group">
                <label className="mb-2" htmlFor="role">
                  Role
                </label>
                <TextField
                  fullWidth
                  id="role"
                  name="role"
                  value={role}
                  disabled
                />
              </FormControl>
            </div>
            <div className="col">
              <FormControl fullWidth className="form-group">
                <label className="mb-2" htmlFor="role">
                  Department
                </label>
                <TextField
                  fullWidth
                  id="department"
                  name="department"
                  value={department}
                  disabled
                />
              </FormControl>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col">
              <FormControl fullWidth className="form-group">
                <label className="mb-2" htmlFor="title">
                  Service Detail
                  <span className="text-danger d-inline-block ms-1">*</span>
                </label>
                <TextField
                  fullWidth
                  // placeholder="Title"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                />
              </FormControl>
            </div>
            <div className="col">
              <div className="form-group">
                <label className="mb-2" htmlFor="repair_type">
                  Repair Type
                  <span className="text-danger d-inline-block ms-1">*</span>
                </label>
                <FormControl fullWidth sx={{ height: "45px" }}>
                  <Select
                    displayEmpty
                    placeholder="Repair Type"
                    sx={{
                      height: "100%",
                    }}
                    id="repair_type"
                    value={repair_type}
                    onChange={(event) => {
                      setRepair_type(event.target.value);
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select ServiceType
                    </MenuItem>
                    {repairTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="image" className="mb-2">
              Image
            </label>
            <br />
            {file && (
              <div
                style={{
                  marginBottom: "0.5rem",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  display: "inline-block",
                }}
              >
                <img
                  width={300}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                />
              </div>
            )}
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              {file && (
                <Button
                  onClick={() => {
                    setFile(null);
                    setPreviewImage("");
                    // toast.success("ลบรูปภาพสำเร็จ");
                    toast.success("Delete image successfully");
                  }}
                  size="small"
                  component="label"
                  variant="contained"
                  style={{ backgroundColor: "", color: "white" }}
                  startIcon={<DeleteIcon />}
                >
                  Clear Image
                </Button>
              )}
              <Button
                size="small"
                component="label"
                variant="contained"
                style={{ backgroundColor: "#00C0D1", color: "white" }}
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <VisuallyHiddenInput
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    // toast.success("อัพโหลดรูปภาพสำเร็จ");
                    toast.success("Upload image successfully");
                  }}
                  accept="image/*"
                  id="image"
                  type="file"
                />
              </Button>
            </Box>
          </div>
          <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.5)", mb: "1rem" }} />
          <div className="form-group mb-0">
            <Button
              onClick={handleResetForm}
              sx={{ mr: "0.5rem" }}
              variant="outlined"
              style={{ Color: "#071952", color: "#071952" }}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#0082E0", color: "white" }}
            >
              Submit
            </Button>
          </div>
        </form>
      </Paper>
      <Paper
        elevation={20}
        sx={{ p: "80px", borderRadius: "1.5rem", mt: "1.25rem" }}
      >
        <div className="mb-3 d-flex justify-content-between align-items-end">
          <h2 className="fs-4 fw-semibold mb-0">Service Info</h2>
          <ExportReport />
        </div>
        <div
          style={{
            height: 390,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <DataGrid
            sx={{
              "& p": {
                mb: 0,
              },
            }}
            rows={problemList}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            disableRowSelectionOnClick
          />
        </div>
      </Paper>
    </div>
  );
};

export default Form;
