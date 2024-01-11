import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import  axios from 'axios';



const Update = () => {

    const {id} = useParams();
    const [inputData, setInputData] = useState({
      name: "",
      email: "",
      images: [],
    });
  
    var count = 0;
    var selectedFiles = [];
    var imgs = [];
    
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState([]);
    const [maxSize] = useState(25); // Maximum size in megabytes
    const [maxCount] = useState(5); // Maximum allowed count
  
    function image_to_base (arr) {
      for (let i = 0; i < arr.length; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(arr[i]);
        reader.onload = () => {
          // console.log(reader.result);
          imgs.push(reader.result);
          console.log('imgs from base64',imgs);
        };
      }
    };

    useEffect(() => {
      axios.get('http://localhost:3005/users/'+id)
      .then(res => setInputData(res.data))
      .catch(err => console.log(err))
    }, [id])
    
    
    const handleSubmit =async(event) => {
        event.preventDefault();

        if (!inputData.name.trim() || !inputData.email.trim()) {
          alert("Name and Email are required fields.");
          return;
        }

        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

        if(!inputData.email.match(isValidEmail)){
          alert("Please enter a valid email"); 
          return;
        }
    
    
        // Check if images array is not empty
        if (inputData.images.length === 0) {
          alert("Please upload at least one image.");
          return;
        }
    
       await axios.put('http://localhost:3005/users/'+id, inputData)
        .then(res => {alert("Data Updated Successfully!");
        navigate('/');
    });
    }

    function timeout(delay) {
      return new Promise( res => setTimeout(res, delay) );
  }
    const handleImageChange = async(e) => {
      const files = e.target.files;
      count = files.length;
      console.log(count);
  
      for (let i = 0; i < count; i++) {
        selectedFiles.push(files[i]);
      }
      console.log("selected files:", selectedFiles);
     await image_to_base(selectedFiles);
  
      // Check if the combined size exceeds the maximum size
      const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
      const maxSizeBytes = maxSize * 1024 * 1024; // Convert maxSize to bytes
  
      if (totalSize > maxSizeBytes) {
        alert(`Total size exceeds the maximum allowed size of ${maxSize} MB.`);
        // Clear the input value to prevent filenames from showing after an error
        e.target.value = "";
        return;
      }
  
      // Check if the selected count exceeds the maximum allowed count
      if (selectedFiles.length + selectedImages.length > maxCount) {
        alert(`You can select a maximum of ${maxCount} images.`);
        // Clear the input value to prevent filenames from showing after an error
        e.target.value = "";
        return;
      }
  
      // Update state with selected images
      await timeout(1000);
      // for (let i = 0; i < selectedFiles.length; i++) {
      //   const reader = new FileReader();
      //   reader.readAsDataURL(selectedFiles[i]);
      //   reader.onload = () => {
      //     // console.log(reader.result);
      //     imgs.push(reader.result);
      //     console.log('imgs from base64',imgs);
      //   };
      // }

      const arrr = [...inputData.images];
      console.log('arrr', arrr);
      console.log('imgs', imgs);
      var finalArray = imgs.concat(arrr);
      console.log('finalArray',finalArray);
      setInputData(() => ({
        ...inputData,
        images: finalArray,
      }));
      
      setSelectedImages((prev) => [...prev, ...selectedFiles]);
    };
  
    const handleImageDeleted = (index) => {
      // Create a copy of the array and remove the selected image
      const updatedImages = [...inputData.images];
      updatedImages.splice(index, 1);
      // Update state with the modified array
      setInputData({...inputData, images: updatedImages});
  
      // image_to_base(updatedImages);
      // return false;
    };

    const handleImageDelete = (index) => {
      // Create a copy of the array and remove the selected image
      const updatedImages = [...selectedImages];
      updatedImages.splice(index, 1);
      // Update state with the modified array
      setSelectedImages(updatedImages);
  
      image_to_base(updatedImages);
      return false;
    }; 

  return (
    <div className='d-flex w-100 vh-100 justify-content-center align-items-center'>
    <div className='w-50 border bg-secondary text-white p-5'>
      <div>
          <div>
              <label htmlFor="name">Name:</label>
              <input type='text' name='name' className='form-control' value={inputData.name}
               onChange={e => setInputData({...inputData, name:e.target.value})}/>
          </div>
          <div>
              <label htmlFor="email">Email:</label>
              <input type='email' name='email' className='form-control' value={inputData.email}
              onChange={e => setInputData({...inputData, email:e.target.value})}/>
          </div><br />
          <div>
            <label htmlFor="email">Upload Image:</label>
            <br />
            <div className="fileinput">
              <input
                type="file"
                id="file"
                className="inputfile"
                multiple
                onChange={handleImageChange}
                accept="image/*"
              />
              {/* <h6 style={{float:'right',paddingTop:"6px",paddingRight:'2px'}}>{count} Files Selected</h6> */}
            </div>
          </div>
          <br />
          <div>
          {inputData.images.map((file, index) => (
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
            />
                <button
                  onClick={() =>selectedFiles.length !== 0 ? handleImageDelete(index) :handleImageDeleted(index)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  &#x2715;
                </button>
              </div>
            ))}
           
          {/*  {selectedImages.map((file, index) => (
              <div
                key={index}
                style={{ display: "inline-block", position: "relative" }}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    margin: "5px",
                  }}
                />
                <button
                  onClick={() => handleImageDelete(index)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  &#x2715;
                </button>
              </div>
                ))}*/}
          </div>
          <br />
          <button className='btn btn-primary' onClick={handleSubmit}>Update</button>
      </div>
    </div>
  </div>
  )
}

export default Update
