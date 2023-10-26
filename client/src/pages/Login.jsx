import Axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Container, InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import MySwal from "../components/MySwal";
import { baseUrl } from "../constants/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [passwordInputType, setPasswordInputType] = useState("password");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const jsonData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const response = await Axios.post(`${baseUrl}/auth/login`, jsonData);
      const { data } = response;
      if (data.status === "ok") {
        await MySwal.fire({
          title: "Login Success",
          icon: "success",
        });
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role); // บันทึกบทบาทใน localStorage
        if (data.role === "user") {
          navigate("/Foruser");
        } else if (data.role === "admin") {
          navigate("/Foradmin");
        }
      } else {
        await MySwal.fire({
          title: "Login Failed",
          icon: "warning",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role");
      if (role === "user") {
        navigate("/Foruser");
      } else if (role === "admin") {
        navigate("/Foradmin");
      }
    }
  }, [navigate]);

  return (
    <Container
      sx={{
        height: "100vh",
      }}
      className="p-0"
      component="main"
      maxWidth="full"
    >
      <Grid sx={{ height: "100%" }} container>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            height: "100%",
            backgroundImage: "url(/word-cloud.png)",

            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={2}>
          <Box
            sx={{
              my: 25,
              mx: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h1"
              style={{ color: "#0082E0", fontWeight: "bold" }}
              sx={{ mb: 4 }}
            >
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 4 }}
            >
              <TextField
                name="email"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={passwordInputType}
                id="password"
                name="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      onClick={() => {
                        setPasswordInputType((prev) => {
                          return prev === "password" ? "text" : "password";
                        });
                      }}
                      sx={{ cursor: "pointer" }}
                      position="end"
                    >
                      {passwordInputType === "password" ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <p></p>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ backgroundColor: "#0082E0", color: "white" }}
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href="/register"
                    variant="body1"
                    style={{ color: "#0082E0" }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* </Grid> */}
    </Container>
  );
}
