import Axios from "axios";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState } from "react";

import { baseUrl } from "../constants/api";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  // function stringToColor(string) {
  //   let hash = 0;
  //   let i;

  //   /* eslint-disable no-bitwise */
  //   for (i = 0; i < string.length; i += 1) {
  //     hash = string.charCodeAt(i) + ((hash << 5) - hash);
  //   }

  //   let color = "#";

  //   for (i = 0; i < 3; i += 1) {
  //     const value = (hash >> (i * 8)) & 0xff;
  //     color += `00${value.toString(16)}`.slice(-2);
  //   }
  //   /* eslint-enable no-bitwise */

  //   return color;
  // }

  function stringAvatar(name) {
    const fixedColor = "#0082E0";
    return {
      sx: {
        bgcolor: fixedColor,
        width: 100,
        height: 100,
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
      Axios.get(`${baseUrl}/users/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          // กำหนดข้อมูลผู้ใช้ใน state
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // ถ้าไม่มี token ให้กำหนดค่าใน state ให้เป็น null
      setUser(null);
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
          <p
            style={{
              color: "#0082E0", // สีของฟอนต์ที่คุณต้องการ
              fontSize: "150%",
              marginBottom: "30px",
              marginTop: "20px",
            }}
          >
            Hello, {user.fname} {user.lname}
          </p>
        </Box>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </Box>
  );
}
