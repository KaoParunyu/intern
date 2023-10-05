import React, { useState } from "react";
import "./App";
import UserProfile from "./UserProfile";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from "@mui/material/Button";

import {
  AppBar,
  Toolbar,
  Avatar,
  Box,
  Divider,
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
import {
  Apps,
  Menu,
  ContactMail,
  AssignmentInd,
  Home,
} from "@material-ui/icons";

const theme = createTheme({
  palette: {
    primary: {
      main: '#A0CE7A', // เปลี่ยนเป็นสีที่คุณต้องการ
    },
  },
});

const useStyles = makeStyles((theme) => ({
  menuSliderContainer: {
    width: 250,
    background: "#511",
    height: "100%",
  },
  avatar: {
    margin: "0.5rem auto",
    padding: "1rem",
    width: theme.spacing(13),
    height: theme.spacing(13),
  },
  listItem: {
    color: "red",
  },
}));

const listItems = [
  // {
  //   listIcon: <Home />,
  //   listText: "Home",
  // },
  // {
  //   listIcon: <AssignmentInd />,
  //   listText: "Resume",
  // },
  // {
  //   listIcon: <Apps />,
  //   listText: "Portfolio",
  // },
  // {
  //   listIcon: <ContactMail />,
  //   listText: "Contacts",
  // },
];

export default function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

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
      }}
    >
      <Avatar
        className={classes.avatar}
        src="https://i.ibb.co/rx5DFbs/avatar.png"
        alt="Juaneme8"
      />
      
      <Divider />
      <UserProfile />
      <List>
        {listItems.map((listItem, index) => (
          <ListItem className={classes.listItem} button key={index}>
            <ListItemIcon className={classes.listItem}>
              {listItem.listIcon}
            </ListItemIcon>
            <ListItemText primary={listItem.listText} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" onClick={handleLogout}>Logout</Button>
    </Box>
  );
  
  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem('token');
    window.location = '/login'
  }

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
  <AppBar position="static" style={{ background: theme.palette.primary.main }}>
    <Toolbar>
      <IconButton onClick={toggleSlider}>
        <Menu />
      </IconButton>
      <Typography>repair notifications</Typography>
      
      <Drawer open={open} anchor="over" onClose={toggleSlider}>
        {sideList()}
      </Drawer>
    </Toolbar>
  </AppBar>
</ThemeProvider>

    </>
  );
}
