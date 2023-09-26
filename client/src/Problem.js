import './App.css'
import { useState } from 'react';
import Axios from 'axios'
import { Button } from '@mui/material';




const Form = () => {

  const [problemList, setProblemlist] = useState([]);
  const getProblem = () => {
    Axios.get('http://localhost:3333/repair_notifications').then((response) => {
      setProblemlist(response.data);
    });

  }

  return (

    <div className="container">
      <h1>Form</h1>
      <form className="form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          {/* <input type="text" id="firstName" name="firstName" /> */}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          {/* <input type="text" id="lastName" name="lastName" /> */}
        </div>
        <div className="form-group">
          <label htmlFor="problem">Problem:</label>
          <input type="text" id="problem" name="problem" />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" name="image" />
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" className="submit-button" />
        </div>
        <div>
          <Button className='btn btn-primary' onClick={getProblem} >show</Button>

          {problemList.map((val, key) => {
            return (
              <div className="card">
                <div className="card-body text-left">
                  <p className='card-text'>title: {val.title}</p>
                  <p className='card-text'>image_url: {val.image_url}</p>
                  <p className='card-text'>created_at: {val.created_at}</p>
                  <p className='card-text'>probleam: {val.title}</p>
                  <p className='card-text'>probleam: {val.title}</p>
                  <p className='card-text'>probleam: {val.title}</p>



                </div>
                </div>
                )
          
          
          }
          
          )
          }
              </div>
      </form>
    </div>




  )


};

export default Form;


