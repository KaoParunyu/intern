import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import Axios from 'axios';

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [problemList, setProblemList] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  const getProblem = async () => {
    try {
      const response = await Axios.get('http://localhost:3333/repair_notifications');
      const data = response.data;
      setProblemList(data);

      const userIds = data.map((val) => val.user_id);
      const usersResponse = await Axios.get(`http://localhost:3333/users?ids=${userIds.join(',')}`);
      const users = usersResponse.data;

      const repairTypesResponse = await Axios.get('http://localhost:3333/repair_types');
      const repairTypesData = repairTypesResponse.data;
      const repairTypesMap = {};
      repairTypesData.forEach((repairType) => {
        repairTypesMap[repairType.id] = repairType.name;
      });

      const newRows = data.map((val) => ({
        id: val.id,
        lastName: '',
        firstName: '',
        problem: val.title,
        repair_type_id: val.repair_type_id,
        repair_type: repairTypesMap[val.repair_type_id] || '', // ใช้ชื่อ repair_type จากข้อมูล repairTypesMap
        status_id: val.status_id,
        created_at: val.created_at,
        modified_date: val.modified_date,
        image_url: val.image_url,
      }));

      newRows.forEach((row) => {
        const user = users.find((user) => user.id === row.id);  
        if (user) {
          row.lastName = user.lname;
          row.firstName = user.fname;
        }
      });

      setRows(newRows);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const getStatusOptions = async () => {
    try {
      const response = await Axios.get('http://localhost:3333/status');
      const data = response.data;
      setStatusOptions(data);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    getProblem();
    getStatusOptions();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'problem', headerName: 'problem', width: 400 },
    { field: 'repair_type', headerName: 'repair_type', width: 150 },
    { field: 'created_at', headerName: 'created_at', width: 150 },
    { field: 'modified_date', headerName: 'modified_date', width: 180 },
    { field: 'status_id', headerName: 'status_id', width: 130, 
    
    renderCell: (params) => {
      const status = statusOptions.find((status) => status.id === params.value);
       return (
    <select
      value={selectedStatus[params.row.id] || params.value} // ใช้ selectedStatus หากมีค่า, ไม่งั้นใช้ค่าเดิม
      onChange={(e) => {
        setSelectedStatus({
          ...selectedStatus,
          [params.row.id]: e.target.value, // เก็บค่าใน selectedStatus
        });
      }}
    >
      {statusOptions.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
    },
    
    },
    { field: 'image_url', headerName: 'image_url', width: 130 },
  ];

 

  const handleSubmit = async () => {
    try {
      // สร้างอาร์เรย์ของสถานะที่มีการเปลี่ยนแปลง
      const updatedStatus = [];
      for (const row of rows) {
        
        const newStatusId = selectedStatus[row.id]; 
        if (newStatusId !== undefined && newStatusId !== row.status_id) {
          updatedStatus.push({
            id: row.id,
            status_id: newStatusId,
          });
        }
        for (const row of rows) {
          const newStatusId = selectedStatus[row.id];
          console.log(`Row ID: ${row.id}, New Status ID: ${newStatusId}`);
          // ... ตรวจสอบและอัปเดตสถานะต่อไป
        }
        
      }
  
      // ส่งข้อมูลการอัปเดตไปยัง API หรือฐานข้อมูล
      for (const statusData of updatedStatus) {
        await Axios.put(`http://localhost:3333/repair_notifications/${statusData.id}`, {
          status_id: statusData.status_id,
        });
      }
  
      // ล้างข้อมูลที่เลือกใน Dropdown
      setSelectedStatus({});
    } catch (error) {
      console.error('Error:', error);
    }
  };
  






  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
      <Button
  variant="contained"
  color="primary"
  onClick={handleSubmit}
>
  Submit
</Button>

    </div>
    
  );
}
