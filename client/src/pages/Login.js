import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { useEffect } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);

export default function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const jsonData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    fetch("http://localhost:3333/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          MySwal.fire({
            title: "เข้าสู่ระบบสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
          }).then(() => {
            localStorage.setItem("role", data.role); // บันทึกบทบาทใน localStorage
            localStorage.setItem("token", data.token);
            if (data.role === "user") {
              window.location = "/Foruser";
            } else if (data.role === "admin") {
              window.location = "/Foradmin";
            }
          });
        } else {
          MySwal.fire({
            title: "อีเมลล์หรือรหัสผ่านไม่ถูกต้อง",
            icon: "warning",
            confirmButtonText: "ตกลง",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("role");
      if (role === "user") {
        window.location = "/Foruser";
      } else if (role === "admin") {
        window.location = "/Foradmin";
      }
    }
  }, []);

  return (
    <div>
      <Container component="main" maxWidth="full">
        <Grid
          sx={{
            // sx คือคุณสมบัติพิเศษ ซึ่งถูกใช้ในการกำหนดรูปแบบและสไตล์
            marginTop: 5,
          }}
        >
          <Grid container>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage:
                  "url(https://www.projectsmart.co.uk/img/tw-project-management-word-cloud.jpg)",

                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Grid //  หน้าจอขนาดเล็กขึ้น (extra small)
              item //หน้าจอขนาดเล็ก  (small)
              xs={12} //  หน้าจอขนาดกลาง (medium)
              sm={8}
              md={5}
              component={Paper}
              elevation={10}
            >
              <Box
                sx={{
                  my: 25,
                  mx: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography component="h1" variant="h3">
                  Sign in
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Link href="/register" variant="body1">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}