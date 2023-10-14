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
import Swal from "sweetalert2";
import { toast } from "sonner";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import withReactContent from "sweetalert2-react-content";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { baseUrl } from "../constants/api";

import ExportReport from "./ExportReport";

const MySwal = withReactContent(Swal);

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [repair_type, setRepair_type] = useState("");
  const [repairTypes, setRepairTypes] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [problemList, setProblemlist] = useState([]);
  const [file, setFile] = useState();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({ fname: "", lname: "" });

  const handleOpen = (image) => {
    setPreviewImage(image);
    setOpen(true);
  };
  const handleClose = () => {
    setPreviewImage("");
    setOpen(false);
  };

  const moment = require("moment-timezone");

  const sortedProblemList = [...problemList].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return timeB - timeA;
  });
  const filteredAndSortedRows = sortedProblemList.filter(
    (row) =>
      row.fname === loggedInUser.fname && row.lname === loggedInUser.lname
  );

  const getMe = async () => {
    try {
      const response = await Axios.get(`${baseUrl}/me`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = response.data;
      setFirstName(data.fname);
      setLastName(data.lname);
      setRole(data.role);
      setLoggedInUser(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getProblem = async () => {
    try {
      const response = await Axios.get(`${baseUrl}/repair_notifications`);
      const data = response.data;
      setProblemlist(data);

      const repairTypesResponse = await Axios.get(`${baseUrl}/repair_types`);
      const repairTypesData = repairTypesResponse.data;
      setRepairTypes(repairTypesData);

      const statusTypesResponse = await Axios.get(`${baseUrl}/status`);
      const statusTypesData = statusTypesResponse.data;
      setStatusTypes(statusTypesData);

      const updatedData = data.map((problem) => {
        const thaiTime = moment(problem.created_at).tz("Asia/Bangkok").format();
        return {
          ...problem,
          created_at: thaiTime,
        };
      });

      setProblemlist(updatedData);

      // เรียกข้อมูล user จาก API ตามค่า user_id ในแต่ละรายการ
      const userIds = data.map((val) => val.user_id);
      const usersResponse = await Axios.get(
        `${baseUrl}/users?ids=${userIds.join(",")}`
      );
      const users = usersResponse.data;

      // รวมข้อมูล fname และ lname เข้ากับแต่ละแถวของ problemList
      const updatedProblemList = data.map((problem) => {
        const user = users.find((user) => user.id === problem.user_id);
        return {
          ...problem,
          fname: user ? user.fname : "",
          lname: user ? user.lname : "",
        };
      });

      setProblemlist(updatedProblemList);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const postProblem = async (e) => {
    e.preventDefault();

    if (!title && !repair_type) {
      MySwal.fire({
        title: "กรุณากรอก Title และเลือก Repair Type",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (!title) {
      MySwal.fire({
        title: "กรุณากรอก Title",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (!repair_type) {
      MySwal.fire({
        title: "กรุณาเลือก Repair Type",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    MySwal.fire({
      title: "คุณต้องการแจ้งปัญหาหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
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
            `${baseUrl}/postproblem`,
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
          toast.success("แจ้งปัญหาสำเร็จ");
          getProblem();
          setTitle("");
          setRepair_type("");
          setFile(null);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    });
  };

  const handleResetForm = () => {
    MySwal.fire({
      title: "คุณต้องการรีเซ็ตฟอร์มหรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setTitle("");
        setRepair_type("");
        setFile(null);
        toast.success("รีเซ็ตฟอร์มสำเร็จ");
      }
    });
  };

  useEffect(() => {
    // เรียกใช้ getProblem เมื่อคอมโพแนนต์ถูกโหลดครั้งแรก
    getMe();
    getProblem();
  }, []);

  const columns = [
    { field: "id", headerName: "Id", width: 50 },
    { field: "fname", headerName: "First Name", width: 150 },
    { field: "lname", headerName: "Last Name", width: 150 },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "repair_type_id",
      headerName: "Repair Type",
      width: 100,
      valueGetter: (params) => {
        const repairType = repairTypes.find((type) => type.id === params.value);
        return repairType ? repairType.name : "";
      },
    },
    {
      field: "status_id",
      headerName: "Status",
      width: 100,
      valueGetter: (params) => {
        const statusType = statusTypes.find((type) => type.id === params.value);
        return statusType ? statusType.name : "";
      },
    },
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
      headerName: "Modified Date At",
      width: 150,
      valueGetter: (params) => {
        const thaiTime = moment(params.value)
          .tz("Asia/Bangkok")
          .format("DD/MM/YYYY - HH:mm");
        return thaiTime;
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
    <div className="container">
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
              พรีวิว
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
      <h1 className="mt-4 mb-3 fw-semibold fs-2">User</h1>
      <Paper
        elevation={3}
        sx={{ p: "1.25rem", borderRadius: "0.5rem", mb: "1.25rem" }}
      >
        <h2 className="mb-3 fs-3 fw-semibold">ฟอร์มแจ้งซ่อม</h2>
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
          </div>
          <div className="row mt-3">
            <div className="col">
              <FormControl fullWidth className="form-group">
                <label className="mb-2" htmlFor="title">
                  Title
                  <span className="text-danger d-inline-block ms-1">*</span>
                </label>
                <TextField
                  fullWidth
                  placeholder="Title"
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
                      Select Repair Type
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
                    toast.success("ลบรูปภาพสำเร็จ");
                  }}
                  size="small"
                  component="label"
                  variant="contained"
                  startIcon={<DeleteIcon />}
                >
                  Clear Image
                </Button>
              )}
              <Button
                size="small"
                component="label"
                variant="contained"
                color="secondary"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
                <VisuallyHiddenInput
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    toast.success("อัพโหลดรูปภาพสำเร็จ");
                  }}
                  accept="image/*"
                  id="image"
                  type="file"
                />
              </Button>
            </Box>
          </div>
          <Divider sx={{ mb: "1rem" }} />
          <div className="form-group">
            <Button
              onClick={handleResetForm}
              sx={{ mr: "0.5rem" }}
              variant="outlined"
              color="error"
            >
              Reset
            </Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </div>
        </form>
      </Paper>
      <Paper
        elevation={3}
        sx={{ p: "1.25rem", borderRadius: "0.5rem", mb: "1rem" }}
      >
        <div className="mb-3 d-flex justify-content-between align-items-end">
          <h2 className="fs-3 fw-semibold mb-0">ตารางแจ้งซ่อม</h2>
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
            rows={filteredAndSortedRows}
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
