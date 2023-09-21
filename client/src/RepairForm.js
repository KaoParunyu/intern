import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import Axios from 'axios';

export default function DataTable() {
  const [rows, setRows] = useState([]);
  const [problemList, setProblemList] = useState([]);

  const getProblem = () => {
    Axios.get('http://localhost:3333/repair_notifications').then((response) => {
      const data = response.data;
      setProblemList(data);

      // สร้าง rows จากข้อมูลที่ได้
      const newRows = data.map((val) => ({
        id: val.id,
        lastName: val.user_id,
        firstName: val.user_id,
        age: val.title,
        age: val.status_id,
        created_at: val.created_at,
        modified_date: val.modified_date,
      }));
      setRows(newRows);
    });
  }

  useEffect(() => {
    getProblem();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 40 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'problem', headerName: 'problem', width: 400 },
    { field: 'created_at', headerName: 'created_at', width: 150 },
    { field: 'modified_date', headerName: 'modified_date', width: 180 },
    { field: 'status_id', headerName: 'status_id', width: 130 },
   
  ];

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
       
    </div>
  );
}
