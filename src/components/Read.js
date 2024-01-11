import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import  axios from 'axios';

const Read = () => {

   // useparam is used to get the id from the url parameter
    const {id} = useParams();

    // initialize inputState with defalut structure to show data from json server
    const [Data, setData] = useState({
      name: "",
      email: "",
      images: [],
    });

    // useeffect is used to get the data from the json server
    useEffect(() => {
        axios.get('http://localhost:3005/users/'+id)
        .then(res => setData(res.data))
        .catch(err => console.log(err))
      }, [id]); 

  return (
    <div className='d-flex w-100 vh-100 justify-content-center align-items-center'>
        <div className='w-50 border bg-secondary text-white p-5'>
           <h2>User Data</h2>
           <p>Name: {Data.name}</p>
           <p>Email: {Data.email}</p>
           <div>
            {Data.images.map((file, index) => (
              <div
                key={index}
                style={{ display: "inline-block", position: "relative" }}
              >
                <img
                  src={file}
                  alt={`Preview ${index + 1}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    margin: "5px",
                  }}
                /> <br />
              </div>
            ))}
          </div>
           <Link className='text-white' to='/'>Back</Link>
        </div>
    </div>
  )
}

export default Read
