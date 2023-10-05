import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import Axios from 'axios';


export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [problemList, setProblemList] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [searchText, setSearchText] = useState("");

  const moment = require('moment-timezone');

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('http://localhost:3333/authen',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
      }
      
    })
      .then(response=> response.json())
      .then(data => {
        if (data.status === 'ok'){
          // localStorage.removeItem('token')

          // alert('authen Success')
          
        } else {
          alert('authenn failed')
          localStorage.removeItem('token')
          window.location = '/login'
        }
        
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  },[])

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

      const updatedData = data.map((problem) => {
        const thaiTime = moment(problem.created_at).tz('Asia/Bangkok').format();
        return {
          ...problem,
          created_at: thaiTime,
        };
      });
  
      setProblemList(updatedData);


      const newRows = data
      
      .filter((val) => {
        const lowerSearchText = searchText.toLowerCase();
        return (
          (val.id && val.id.toString().includes(lowerSearchText)) || // ตรวจสอบว่า val.id มีค่า
          (val.fname && val.fname.toLowerCase().includes(lowerSearchText)) || // ตรวจสอบว่า val.fname มีค่า
          (val.lname && val.lname.toLowerCase().includes(lowerSearchText)) // ตรวจสอบว่า val.lname มีค่า

        );
      })
      
      .map((val) => ({
        id: val.id,
        user_id: val.user_id, // เพิ่ม user_id ใน newRows
        lastName: val.lname,
        firstName: val.fname,
        problem: val.title,
        repair_type_id: val.repair_type_id,
        repair_type: repairTypesMap[val.repair_type_id] || '',
        status_id: val.status_id,
        created_at: val.created_at,
        modified_date: val.modified_date,
        image_url: val.image_url,
      }));

      newRows.forEach((row) => {
        const user = users.find((user) => user.id === row.user_id);  // เปรียบเทียบกับ user_id แทน
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
  }, [searchText]);




  const columns = [
    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'firstName', headerName: 'First name', width: 130 }, // เปลี่ยนเป็น firstName
    { field: 'lastName', headerName: 'Last name', width: 130 }, // เปลี่ยนเป็น lastName
        { field: 'problem', headerName: 'problem', width: 400 },
    { field: 'repair_type', headerName: 'repair_type', width: 100 },
    { field: 'created_at', headerName: 'created_at', width: 150 , valueGetter: (params) => {
      const thaiTime = moment(params.value).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
      return thaiTime;
    }, },
    { field: 'modified_date', headerName: 'modified_date', width: 180 , valueGetter: (params) => {
      const thaiTime = moment(params.value).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
      return thaiTime;
    }, },
    { field: 'status_id', headerName: 'status_id', width: 130, 
    
    
    renderCell: (params) => {
  
      const status = statusOptions.find((status) => status.id === params.value);
       return (
        
        <div> 

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
    </select></div>
  );
    },
    
    },
    { field: 'image_url', headerName: 'image_url', width: 130, },
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

      // ดึงข้อมูลใหม่
      await getProblem();
  
      // // ล้างข้อมูลที่เลือกใน Dropdown
      // setSelectedStatus({});
      setSelectedRows([]);

    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleSearch = () => {
    getProblem(); // เรียกใช้ getProblem() เพื่อค้นหาข้อมูลใหม่
  };


  const [selectedRows, setSelectedRows] = useState([]);

  const deleteProblem = () => {
    if (selectedRows.length === 0) {
      // ถ้าไม่มีแถวที่ถูกเลือก ไม่ต้องทำอะไร
      return;
    }
  
    const selectedIds = selectedRows.map((row) => row.id);
  
    Axios.delete(`http://localhost:3333/delete/${selectedIds.join(',')}`)
    .then((response) => {
      if (response.status === 200) {
        console.log('ลบข้อมูลเรียบร้อยแล้ว');
        // ทำอย่างอื่น ๆ ที่คุณต้องการหลังจากลบสำเร็จ
      } else {
        console.log('เกิดข้อผิดพลาดในการลบข้อมูล');
        // จัดการกับข้อผิดพลาด
      }
    })
    .catch((error) => {
      console.error('เกิดข้อผิดพลาดในการส่งคำขอ DELETE:', error);
      // จัดการกับข้อผิดพลาดอื่น ๆ ที่อาจเกิดขึ้นในระหว่างการส่งคำขอ
    });
  
    // เคลียร์การเลือก
    setSelectedRows([]);
  };
  
  



  return (
    <div style={{ height: 400, width: '100%' }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />


      <DataGrid
        rows={rows}
        columns={columns}
        selectionModel={selectedRows}
        onSelectionModelChange={(newSelection) => {
          setSelectedRows(newSelection.selectionModel);
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick

      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>

      <Button variant="contained" color="secondary" onClick={deleteProblem}>
  Delete
</Button>




    </div>
    
  );
}
