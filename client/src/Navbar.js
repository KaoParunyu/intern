

import Navbar from 'react-bootstrap/Navbar';



function Navbar1() {
  return (
    <>
    
  
<Navbar bg="secondary" data-bs-theme="white" >

      <Navbar.Collapse className="justify-content-start">
          <Navbar.Text>
            
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


    </>
  );
}

export default Navbar1;
