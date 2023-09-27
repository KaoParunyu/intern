import React, { useEffect, useState } from 'react';
 

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก Local Storage โดยใช้ชื่อ "token"
    const token = localStorage.getItem('token');

    // ตรวจสอบว่ามี token หรือไม่
    if (token) {
      // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์ของคุณโดยใช้ token
      fetch('http://localhost:3333/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+token
        },
      })
        .then((response) => response.json())
        .then((userData) => {
          // กำหนดข้อมูลผู้ใช้ใน state
          setUser(userData);
          console.log(userData);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, []);

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.fname} {user.lname}!</p>
            
          {/* แสดงข้อมูลผู้ใช้ที่คุณต้องการ */}
        </div>
      ) : (
        <p>Please log in to view your profile.</p>
      )}
    </div>
  );
}
