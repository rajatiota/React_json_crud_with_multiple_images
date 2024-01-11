import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import  axios from 'axios';

const Read = () => {

    const {id} = useParams();
    const [Data, setData] = useState({
      name: "",
      email: "",
      images: [],
    });
    // var imageArr = [];

    useEffect(() => {
        axios.get('http://localhost:3005/users/'+id)
        .then(res => setData(res.data))
        .catch(err => console.log(err))
      }, [id]);

    // imageArr =[Data.images];
    // console.log('imageArr',imageArr); 

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
