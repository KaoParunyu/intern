import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { Box } from "@mui/material";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: 50,
        height: 50,
        marginBottom: "0.5rem",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก Local Storage โดยใช้ชื่อ "token"
    const token = localStorage.getItem("token");

    // ตรวจสอบว่ามี token หรือไม่
    if (token) {
      // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์ของคุณโดยใช้ token
      fetch("http://localhost:3333/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((userData) => {
          // กำหนดข้อมูลผู้ใช้ใน state
          setUser(userData);
          console.log(userData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {user ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar {...stringAvatar(`${user.fname} ${user.lname}`)} />
          <p>
            {user.fname} {user.lname}!
          </p>
        </Box>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </Box>
  );
}
