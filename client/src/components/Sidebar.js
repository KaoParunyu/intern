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

const MySwal = withReactContent(Swal);

const theme = createTheme({
  palette: {
    primary: {
      main: "#A0CE7A",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  menuSliderContainer: {
    background: "#511",
  },
}));

const listItems = [
  {
    listIcon: <Dashboard />,
    listText: "Dashboard",
    value: "/Dashboard",
    isAdminOnly: true,
  },
  {
    listIcon: <AssignmentInd />,
    listText: "User",
    value: "/Foruser",
    isAdminOnly: false,
  },
  {
    listIcon: <Home />,
    listText: "Admin",
    value: "/Foradmin",
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
        alignItems: "center",
        width: 250,
        padding: "1rem",
      }}
    >
      <UserProfile />
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
      <Button variant="contained" onClick={handleLogout}>
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
            <Typography style={{ marginLeft: "1rem", fontSize: "1.25rem" }}>
              Repair Notifications
            </Typography>
            <Drawer open={open} anchor="over" onClose={toggleSlider}>
              {sideList()}
            </Drawer>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
}
