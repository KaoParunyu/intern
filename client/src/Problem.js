import './App.css'
import { useState, useEffect } from 'react';
import Axios from 'axios'
// import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Form = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [title, setTitle] = useState("");
  const [image_url, setImage_url] = useState("");
  const [repair_type, setRepair_type] = useState("");
  const [repairTypes, setRepairTypes] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [problemList, setProblemlist] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({ fname: "", lname: "" });

  const getMe = async () => {
    const response = await Axios.get('http://localhost:3333/me', {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
      }
    })
    const data = response.data;
    setFirstName(data.fname);
    setLastName(data.lname);
  }

  const getProblem = async () => {
    try {
      const response = await Axios.get('http://localhost:3333/repair_notifications');
      const data = response.data;
      setProblemlist(data);

      const repairTypesResponse = await Axios.get('http://localhost:3333/repair_types');
      const repairTypesData = repairTypesResponse.data;
      setRepairTypes(repairTypesData);

      const statusTypesResponse = await Axios.get('http://localhost:3333/status');
      const statusTypesData = statusTypesResponse.data;
      setStatusTypes(statusTypesData);



      // เรียกข้อมูล user จาก API ตามค่า user_id ในแต่ละรายการ
      const userIds = data.map((val) => val.user_id);
      const usersResponse = await Axios.get(`http://localhost:3333/users?ids=${userIds.join(',')}`);
      const users = usersResponse.data;

      // รวมข้อมูล fname และ lname เข้ากับแต่ละแถวของ problemList
      const updatedProblemList = data.map((problem) => {
        const user = users.find((user) => user.id === problem.user_id);
        return {
          ...problem,
          fname: user ? user.fname : '',
          lname: user ? user.lname : '',
        };
      });

      setProblemlist(updatedProblemList);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const postProblem = async (e) => {
    e.preventDefault()
    try {
      await Axios.post('http://localhost:3333/postproblem', {
        title: title,
        repair_type_id: repair_type,
        image_url: image_url,
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('token')
        }
      });
      // เรียกใช้ฟังก์ชัน getProblem เพื่อดึงข้อมูลล่าสุดหลังจากทำการโพสต์
      getProblem();
      setTitle('');
      setRepair_type('');

    } catch (error) {
      console.error('Error:', error);
    }
  }

  
  useEffect(() => {
    // เรียกใช้ getProblem เมื่อคอมโพแนนต์ถูกโหลดครั้งแรก
    getMe()
    getProblem();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'fname', headerName: 'First Name', width: 130 },
    { field: 'lname', headerName: 'Last Name', width: 130 },
    { field: 'title', headerName: 'Title', width: 400 },
    {
      field: 'repair_type_id', headerName: 'repair_type', width: 400, valueGetter: (params) => {
        const repairType = repairTypes.find((type) => type.id === params.value);
        return repairType ? repairType.name : '';
      }
    },
    {
      field: 'status_id',
      headerName: 'status_id',
      width: 130,
      valueGetter: (params) => {
        const statusType = statusTypes.find((type) => type.id === params.value);
        return statusType ? statusType.name : '';
      }
    }
    ,
    { field: 'image_url', headerName: 'Image', width: 200 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
  ];

  // เรียงข้อมูลใน problemList จากใหม่ไปเก่า
  const sortedProblemList = [...problemList].sort((a, b) => {
    // ใช้ตัวแปรที่เกี่ยวข้องกับเวลาที่สร้าง (created_at) ของแต่ละรายการในอาร์เรย์
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();

    // เรียงลำดับจากใหม่ไปเก่าโดยใช้เวลาที่สร้าง
    return timeB - timeA;
  });




  return (
    <div className="container">
      <h1>Form</h1>
      <form className="form">
        {/* ข้อมูลอื่น ๆ ในฟอร์ม */}
        <div className="form-group">
          <label htmlFor="firstName">firstName:</label>
          <input disabled type="text" id="firstName" name="firstName" value={firstName} onChange={(event) => { setFirstName(event.target.value) }} />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">LastName:</label>
          <input disabled type="text" id="lastName" name="lastName" value={lastName} onChange={(event) => { setLastName(event.target.value) }} />
        </div>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={title} onChange={(event) => { setTitle(event.target.value) }} />
        </div>






        <div className="form-group">
          <label htmlFor="repair_type">Repair Type:</label>
          <select type="select" id="repair_type" name="repair_type" value={repair_type} onChange={(event) => { setRepair_type(event.target.value); }}>
            <option value="">Select Repair Type</option>
            {repairTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>



        <div className="form-group">
          <label htmlFor="image_url">Image:</label>
          <input type="file" id="image_url" name="image_url" onChange={(event) => { setImage_url(event.target.value) }} />
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" className="submit-button" onClick={postProblem} />
        </div>
        {/* ปุ่มแสดงข้อมูล */}
        <div>

          {/* ตารางข้อมูล */}
          <div style={{ height: 390, width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <DataGrid
              rows={sortedProblemList}

              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
            />
          </div>
        </div>
      </form>
    </div>
  )
};

export default Form;