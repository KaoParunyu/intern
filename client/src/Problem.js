import  './App.css'
const form = () =>

(

  <>

<div className="container">
      <h1>Form</h1>
      <form className="form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" name="firstName" />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" name="lastName" />
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
      </form>
    </div>



 
  </>


);

export default form;
