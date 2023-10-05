import React, { useState } from "react";
import "./App";
import UserProfile from "./UserProfile";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
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
import { Menu, AssignmentInd, Home } from "@material-ui/icons";

const theme = createTheme({
  palette: {
    primary: {
      main: "#A0CE7A", // เปลี่ยนเป็นสีที่คุณต้องการ
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
    listIcon: <AssignmentInd />,
    listText: "User",
    value: "/Foruser",
  },
  {
    listIcon: <Home />,
    listText: "Admin",
    value: "/Foradmin",
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
        ))}
      </List>
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location = "/login";
  };

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
            <Typography style={{ marginLeft: "1rem" }} variant="h6">
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
