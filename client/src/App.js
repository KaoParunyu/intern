
//import Container from 'react-bootstrap/Container';
//import Login from './Login';
//import Navbar from 'react-bootstrap/Navbar';
// import Tabletest from './Tabletest';
import Foradmin  from './Foradmin';
import Login from './Login';
import Problem from './Problem';
import RepairForm from './RepairForm';
import RepairList from './RepairList';


function App() {
  const handleSubmitRepairForm = (formData) => {
    // ใส่โค้ดส่งข้อมูลการแจ้งซ่อมที่นี่ (fetch POST ไปที่ API)
   fetch('http://localhost:3333', { method: 'POST', body: formData });
  };





  return (
    <>
    
    <div>
    <Foradmin/>
      {/* <Tabletest/> */}
      <Problem/>
      <Login/>
      <h1>Repair Notification System</h1>
      <RepairForm onSubmit={handleSubmitRepairForm} />
      <h2>รายการแจ้งซ่อม</h2>
      <RepairList />
      </div>
      {/*
<Navbar bg="primary" data-bs-theme="dark" >
      <Container>
        <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>*/}
    </>
  );
}

export default App;