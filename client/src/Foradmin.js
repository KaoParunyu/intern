import Sidebar from './Sidebar';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';


function OffcanvasExample() {
  return (
    <>
    
  
<Navbar bg="white" data-bs-theme="white" >
      <Container>
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
      </Container>
    </Navbar>

    
    </>
  );
}

export default OffcanvasExample;
/*import DataGrid from '@mui/material/Grid';

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
*/
