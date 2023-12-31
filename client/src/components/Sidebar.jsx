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
} from "@material-ui/core";
import { useState } from "react";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Menu, AssignmentInd, Home, Dashboard } from "@material-ui/icons";

import MySwal from "./MySwal";
import UserProfile from "./UserProfile";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0082E0",
    },
  },
});

const useStyles = makeStyles(() => ({
  listItem: {
    color: "#0082E0",
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
  const classes = useStyles();
  const navigate = useNavigate();
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
        background: "#E6EFEA",
      }}
    >
      <UserProfile />
      <Divider sx={{ borderColor: "#AFD238" }} />
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
      <Button
        variant="contained"
        style={{ backgroundColor: "#0082E0", color: "white" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );

  const handleLogout = async (event) => {
    event.preventDefault();
    setOpen(false);
    const result = await MySwal.fire({
      // title: "คุณต้องการออกจากระบบใช่หรือไม่?",
      title: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      localStorage.removeItem("token");
      navigate("/login");
    }
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
              <Menu className="text-white" />
            </IconButton>
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
