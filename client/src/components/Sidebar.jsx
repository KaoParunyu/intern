import Swal from "sweetalert2";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  CssBaseline,
  Drawer,
  Typography,
} from "@material-ui/core";
import withReactContent from "sweetalert2-react-content";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Menu, AssignmentInd, Home, Dashboard } from "@material-ui/icons";

import UserProfile from "./UserProfile";
import { Divider } from "@mui/material";

const MySwal = withReactContent(Swal);

const theme = createTheme({
  palette: {
    primary: {
      main: "#169EAB",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  menuSliderContainer: {
    background: "#511",
  },
  listItem: {
    color: "#169EAB",
  },
}));

const listItems = [
  {
    listIcon: <Home />,
    listText: "Administator",
    value: "/Foradmin",
    isAdminOnly: true,
  },
  {
    listIcon: <AssignmentInd />,
    listText: "User",
    value: "/Foruser",
    isAdminOnly: false,
  },

  {
    listIcon: <Dashboard />,
    listText: "Dashboard",
    value: "/Dashboard",
    isAdminOnly: true,
  },
];

export default function App() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleMenuClick = (value) => {
    navigate(value);
  };

  const toggleSlider = () => {
    setOpen(!open);
  };

  const sideList = () => (
    <Box
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: 260,
        padding: "1rem",
        background: "#C6F5E4",
      }}
    >
      <UserProfile />
      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.5)" }} />
      <List>
        {listItems.map((listItem, index) => (
          <>
            {listItem.isAdminOnly && isAdminRole ? (
              <ListItem
                onClick={() => handleMenuClick(listItem.value)}
                className={classes.listItem}
                button
                key={index}
              >
                <ListItemIcon className={classes.listItem}>
                  {listItem.listIcon}
                </ListItemIcon>
                <ListItemText primary={listItem.listText} />
              </ListItem>
            ) : !listItem.isAdminOnly ? (
              <ListItem
                onClick={() => handleMenuClick(listItem.value)}
                className={classes.listItem}
                button
                key={index}
              >
                <ListItemIcon className={classes.listItem}>
                  {listItem.listIcon}
                </ListItemIcon>
                <ListItemText primary={listItem.listText} />
              </ListItem>
            ) : null}
          </>
        ))}
      </List>
      <Divider sx={{ borderColor: "rgba(0, 0, 0, 0.5)", mb: "1rem" }} />
      <Button variant="contained" style={{ backgroundColor: "#071952", color: "white" }} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );

  const handleLogout = (event) => {
    event.preventDefault();
    setOpen(false);
    MySwal.fire({
      title: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        window.location = "/login";
      }
    });
  };

  const isAdminRole = localStorage.getItem("role") === "admin";

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <AppBar
          position="static"
          style={{ background: theme.palette.primary.main }}
        >
          <Toolbar>
            <IconButton onClick={toggleSlider}>
              <Menu />
            </IconButton>
            {/* <Typography style={{ marginLeft: "40rem", fontSize: "2.25rem",fontFamily:"Helvetica", }}>
              Repair Notifications
            </Typography> */}
            <img
              src="/aa.png"
              alt=""
              srcSet=""
              style={{ display: "block", margin: "0 auto" }}
            />

            <Drawer open={open} anchor="over" onClose={toggleSlider}>
              {sideList()}
            </Drawer>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
}
