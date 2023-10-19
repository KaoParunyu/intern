import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import Alert from '@mui/material/Alert';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { baseUrl } from "../constants/api";
const MySwal = withReactContent(Swal);

const theme = createTheme();

export default function SignUp() {
  const [departments, setDepartments] = React.useState([]);
  const [password, setPassword] = React.useState("");

  const handleSubmit = (event) => {
    // เป็นฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้กดปุ่ม Sign Up
    event.preventDefault(); //ป้องกันการโหลดหน้าเว็บใหม่
    const data = new FormData(event.currentTarget); //ใช้้เพื่อเก็บแบบฟอร์มที่ถูกส่งเมื่อผู้ใช้กดปุ่ม Sign Up

    const jsonData = {
      email: data.get("email"),
      password: data.get("password"),
      fname: data.get("firstName"),
      lname: data.get("lastName"),
      role: data.get("role"),
      departmentId: data.get("department"),
    };

    if (
      jsonData.fname === "" ||
      jsonData.lname === "" ||
      jsonData.email === "" ||
      jsonData.password === "" ||
      jsonData.role === "" ||
      jsonData.departmentId === ""
    ) {
      MySwal.fire({
        title: "Please fill in all information",
        icon: "warning",
      });
      return;
    }

    fetch("http://localhost:3333/register", {
      // ส่งคำขอ HTTP POST ไปยัง URL
      method: "POST",
      headers: {
        "Content-Type": "application/json", //ระบุว่าข้อมูลที่ส่งไปยังเซิร์ฟเวอร์เป็น JSON
      },
      body: JSON.stringify(jsonData), //แปลงอ็อบเจ็กต์ jsonData เป็นสตริง JSON
    })
      .then((response) => response.json()) // เพื่อแปลงข้อมูล JSON ที่ถูกส่งกลับมาจากเซิร์ฟเวอร์เป็นอ็อบเจ็กต์ JavaScript
      .then((data) => {
        if (data.status === "ok") {
          MySwal.fire({
            title: "Register Success",
            icon: "success",
          }).then(() => {
            window.location = "/login";
          });
        } else {
          MySwal.fire({
            title: data.message,
            icon: "warning",
            confirmButtonText: "ตกลง",
          });
        }
      })
      .catch((error) => {
        // รับข้อมูลข้อผิดพลาดที่เกิดขึ้นในกรณีที่เกิดข้อผิดพลาดในการส่งคำขอ
        console.error("Error:", error);
      });
  };

  React.useEffect(() => {
    fetch(`${baseUrl}/departments`)
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={2}
          sx={{
            p: "1.25rem",
            borderRadius: "0.5rem",
            mt: "2rem",
          }}
        >
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#071952" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography
              component="h1"
              variant="h3"
              style={{ color: "#071952" }}
            >
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    helperText="Email must end with @onee.one"
                    FormHelperTextProps={{
                      style: {
                        marginLeft: "auto",
                        marginRight: 0,
                        marginTop: 8,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                  {password.length >= 1 && (
                    <>
                      {password.length < 8 ||
                      !/[A-Z]/.test(password) ||
                      !/[^A-Za-z0-9 ]/.test(password) ? (
                        <div
                          class="alert alert-danger d-flex flex-column gap-2 mt-3"
                          role="alert"
                        >
                          {password.length < 8 && (
                            <div
                              style={{
                                fontSize: "0.75rem",
                              }}
                              className="d-flex align-items-center gap-3"
                            >
                              <CloseIcon fontSize="small" />
                              Password must contain at least 8 characters
                            </div>
                          )}
                          {!/[A-Z]/.test(password) && (
                            <div
                              style={{
                                fontSize: "0.75rem",
                              }}
                              className="d-flex align-items-center gap-3"
                            >
                              <CloseIcon fontSize="small" />
                              Password must contain one uppercase letter
                            </div>
                          )}
                          {!/[^A-Za-z0-9 ]/.test(password) && (
                            <div
                              style={{
                                fontSize: "0.75rem",
                              }}
                              className="d-flex align-items-center gap-3"
                            >
                              <CloseIcon fontSize="small" />
                              Password must contain special character
                            </div>
                          )}
                        </div>
                      ) : null}
                    </>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="role">Role</InputLabel>
                    <Select
                      required
                      fullWidth
                      name="role"
                      labelId="role"
                      id="role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="admin">Administator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="department">Department</InputLabel>
                    <Select
                      required
                      fullWidth
                      name="department"
                      labelId="department"
                      id="department"
                    >
                      {departments.map((department) => (
                        <MenuItem value={department.id}>
                          {department.description}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ backgroundColor: "#071952", color: "white" }}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    href="/login"
                    variant="body2"
                    style={{ color: "#071952" }}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
