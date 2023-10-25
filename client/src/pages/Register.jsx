import Axios from "axios";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { Paper } from "@mui/material";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import MySwal from "../components/MySwal";
import { baseUrl } from "../constants/api";

export default function SignUp() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [departments, setDepartments] = useState([]);

  const handleSubmit = async (event) => {
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

    if (Object.values(jsonData).some((value) => value === "")) {
      await MySwal.fire({
        title: "Please fill in all information",
        icon: "warning",
      });
      return;
    }

    const response = await Axios.post(`${baseUrl}/register`, jsonData);
    if (response.data.status === "ok") {
      await MySwal.fire({
        title: "Register Success",
        icon: "success",
      });
      navigate("/login");
    } else {
      await MySwal.fire({
        title: data.message,
        icon: "warning",
      });
    }
  };

  useEffect(() => {
    Axios.get(`${baseUrl}/departments`).then((response) => {
      setDepartments(response.data);
    });
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={20}
        sx={{ p: "50px", borderRadius: "1.5rem", mt: "1.25rem" }}
      >
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#0082E0" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h3"
            style={{ color: "#0082E0", fontWeight: "bold" }}
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
              style={{ backgroundColor: "#0082E0", color: "white" }}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="/login"
                  variant="body2"
                  style={{ color: "#0082E0" }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
