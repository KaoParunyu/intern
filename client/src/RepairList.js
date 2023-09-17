import React, { useEffect, useState } from 'react';

function RepairList() {
  const [repairs, setRepairs] = useState([]);

  useEffect(() => {
    // ใส่โค้ดการโหลดรายการแจ้งซ่อมที่นี่ (fetch จาก API หรือข้อมูลที่คุณมี)
     fetch('http://localhost:3333').then(response => response.json()).then(data => setRepairs(data));
  }, []);

  if (repairs.length === 0) {
    return <p>ไม่มีรายการแจ้งซ่อม</p>;
  }

  return (
    <ul>
      {repairs.map((repair) => (
        <li key={repair.id}>
          <strong>{repair.title}</strong> ({repair.status})<br />
          รายละเอียด: {repair.description}<br />
          ประเภทการซ่อม: {repair.repairType}<br />
          <img src={repair.image_url} alt="รูปภาพ" />
        </li>
      ))}
    </ul>
  );
}

export default RepairList;
