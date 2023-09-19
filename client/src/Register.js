import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';




const theme = createTheme();

export default function SignUp() {
  const handleSubmit = (event) => {                                 // เป็นฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้กดปุ่ม Sign Up
    event.preventDefault();                                       //ป้องกันการโหลดหน้าเว็บใหม่
    const data = new FormData(event.currentTarget);             //ใช้้เพื่อเก็บแบบฟอร์มที่ถูกส่งเมื่อผู้ใช้กดปุ่ม Sign Up

    const jsonData = {
      email: data.get('email'),
      password: data.get('password'),
      fname: data.get('firstName'),
      lname: data.get('lastName'),
      role: data.get('role'),
    }


    fetch('http://localhost:3333/register', {               // ส่งคำขอ HTTP POST ไปยัง URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',               //ระบุว่าข้อมูลที่ส่งไปยังเซิร์ฟเวอร์เป็น JSON
      },
      body: JSON.stringify(jsonData),                    //แปลงอ็อบเจ็กต์ jsonData เป็นสตริง JSON
    })
      .then(response => response.json())                  // เพื่อแปลงข้อมูล JSON ที่ถูกส่งกลับมาจากเซิร์ฟเวอร์เป็นอ็อบเจ็กต์ JavaScript
      .then(data => {
        if (data.status === 'ok') {
          alert('register Success')
          window.location = '/login'
        } else {
          alert('รูปแบบอีเมลล์ไม่ถูกต้องหรืออีเมลล์เคยใช้แล้ว')
        }

      })
      .catch((error) => {                                 // รับข้อมูลข้อผิดพลาดที่เกิดขึ้นในกรณีที่เกิดข้อผิดพลาดในการส่งคำขอ
        console.error('Error:', error);
      });




  };

  return (
    
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h1">
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
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
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
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>

              </Grid>

              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
  );
}