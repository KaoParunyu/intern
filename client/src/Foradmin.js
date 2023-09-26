import Sidebar from './Sidebar';
//import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
// import Register from './Register';
  import RepairForm from './RepairForm';
import Tabletest from './Tabletest';
 import UserProfile from './UserProfile';

function OffcanvasExample() {
  return (
    <>
    
  
<Navbar bg="danger" data-bs-theme="white" >

      <Navbar.Collapse className="justify-content-start">
          <Navbar.Text>
            <Sidebar/>
          </Navbar.Text>
        </Navbar.Collapse>
        <Navbar.Brand href="#home"><div></div>Project</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Mark Otto</a>
          </Navbar.Text>
        </Navbar.Collapse>
  
      
    </Navbar>
    {/* <Register/> */}
    <RepairForm/>
     <UserProfile/> 

    {/* <Tabletest/> */}
    <Link to="/">Home</Link>

    <Link to="/RepairForm">หห</Link>

    </>
  );
}

export default OffcanvasExample;
