import { useState, useEffect } from "react";
import Axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, IconButton, Modal, Typography } from "@mui/material";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
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
  const handleOpen = (image) => {
    setPreviewImage(image);
    setOpen(true);
  };
  const handleClose = () => {
    setPreviewImage("");
    setOpen(false);
  };

  const moment = require("moment-timezone");

  const [loggedInUser, setLoggedInUser] = useState({ fname: "", lname: "" });
  const sortedProblemList = [...problemList].sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return timeB - timeA;
  });
  const filteredAndSortedRows = sortedProblemList.filter(
    (row) =>
      row.fname === loggedInUser.fname && row.lname === loggedInUser.lname
  );

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
        if (data.status !== "ok") {
          alert("authen failed");
          localStorage.removeItem("token");
          localStorage.removeItem("role"); // ลบบทบาทถ้าการตรวจสอบล้มเหลว
          window.location = "/login";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "user") {
      // window.location = '/login';
    }
  }, []);

  const getMe = async () => {
    try {
      const response = await Axios.get("http://localhost:3333/me", {
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
      const response = await Axios.get(
        "http://localhost:3333/repair_notifications"
      );
      const data = response.data;
      setProblemlist(data);

      const repairTypesResponse = await Axios.get(
        "http://localhost:3333/repair_types"
      );
      const repairTypesData = repairTypesResponse.data;
      setRepairTypes(repairTypesData);

      const statusTypesResponse = await Axios.get(
        "http://localhost:3333/status"
      );
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
        `http://localhost:3333/users?ids=${userIds.join(",")}`
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
          const response = await Axios.post(
            "http://localhost:3333/images",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          imagePath = response.data;
        }

        try {
          await Axios.post(
            "http://localhost:3333/postproblem",
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
          // เรียกใช้ฟังก์ชัน getProblem เพื่อดึงข้อมูลล่าสุดหลังจากทำการโพสต์
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
            onClick={() => handleOpen(`http://localhost:3333${params.value}`)}
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <img
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              src={`http://localhost:3333${params.value}`}
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
      <h1 style={{ marginTop: "1rem" }}>User</h1>
      <form className="form">
        {/* ข้อมูลอื่น ๆ ในฟอร์ม */}
        <div className="row">
          <div className="form-group col">
            <label htmlFor="firstName">First Name</label>
            <input
              disabled
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(event) => {
                setFirstName(event.target.value);
              }}
            />
          </div>
          <div className="form-group col">
            <label htmlFor="lastName">Last Name</label>
            <input
              disabled
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(event) => {
                setLastName(event.target.value);
              }}
            />
          </div>
          <div className="form-group col">
            <label htmlFor="role">Role</label>
            <input
              disabled
              type="text"
              id="role"
              name="role"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
              }}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="repair_type">Repair Type : </label>
          <select
            style={{ marginLeft: "0.5rem" }}
            type="select"
            id="repair_type"
            name="repair_type"
            value={repair_type}
            onChange={(event) => {
              setRepair_type(event.target.value);
            }}
          >
            <option value="">Select Repair Type</option>
            {repairTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="image" style={{ marginBottom: "0.5rem" }}>
            Image
          </label>
          <br />
          {file && (
            <div style={{ marginBottom: "0.5rem" }}>
              <img width={300} src={URL.createObjectURL(file)} alt="preview" />
            </div>
          )}
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            {file && (
              <Button
                onClick={() => {
                  setFile(null);
                }}
                size="small"
                component="label"
                variant="contained"
                startIcon={<DeleteIcon />}
              >
                Clear
              </Button>
            )}
            <Button
              size="small"
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
              <VisuallyHiddenInput
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
                accept="image/*"
                id="image"
                type="file"
              />
            </Button>
          </Box>
        </div>
        <div className="form-group mt-2">
          <input
            type="submit"
            value="Submit"
            className="submit-button"
            onClick={postProblem}
          />
        </div>
        {/* ปุ่มแสดงข้อมูล */}
        <div>
          {/* ตารางข้อมูล */}
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
        </div>
      </form>
    </div>
  );
};

export default Form;
