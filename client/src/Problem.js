import './App.css'
import { useState } from 'react';
import Axios from 'axios'
import { Button } from '@mui/material';




const Form = () => {



  const [title, setTitle] = useState("");
  const [repair_type, setRepair_type] = useState("");
  const [problemList, setProblemlist] = useState([]);
  const getProblem = () => {
    
    Axios.get('http://localhost:3333/repair_notifications').then((response) => {
      setProblemlist(response.data);
    });

  }

  const postProblem = () => {
    const user_id = 1;
    Axios.post('http://localhost:3333/postproblem',    {
      title: title,
      repair_type: repair_type,
      user_id: user_id,
       
    }).then(() => {
      setProblemlist([
        ...problemList,
        {
          title: title,
          repair_type: repair_type,
          user_id: user_id,
        }
      ])
    })

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
          <label htmlFor="title">title:</label>
          <input type="text" id="title" name="title" onChange={(event) => {  setTitle(event.target.value)}} />
        </div>
        <div className="form-group">
          <label htmlFor="repair_type">	repair_type:</label>
          <select type="select" id="repair_type" name="repair_type" onChange={(event) => {  setRepair_type(event.target.value)}} > 
          <option value="apple">Apple</option></select>
        </div>
        <div className="form-group">
          <label htmlFor="image_url">Image:</label>
          <input type="file" id="image_url" name="image_url" />
        </div>
        <div className="form-group">
          <input type="submit" value="Submit" className="submit-button" onClick={postProblem}/>
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


