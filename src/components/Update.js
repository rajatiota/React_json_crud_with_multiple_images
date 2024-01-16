import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Update = () => {
  // useparam is used to get the id from the url parameter
  const { id } = useParams();

  // initialize inputState with defalut structure to store in json server
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
  const [maxSize] = useState(2); // Maximum size in megabytes
  const [maxCount] = useState(5); // Maximum allowed count

  // fuction used to convert images into base 64 string format
  function image_to_base(arr) {
    for (let i = 0; i < arr.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(arr[i]);
      reader.onload = () => {
        // console.log(reader.result);
        imgs.push(reader.result);
        console.log("imgs from base64", imgs);
      };
    }
  }

  // useeffect is used to get the data from the json server
  useEffect(() => {
    axios
      .get("http://localhost:3005/users/" + id)
      .then((res) => setInputData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // function delay is useed to delay the next opertation
  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  // handle images change is used to handle the input images
  const handleImageChange = async (e) => {
    const files = e.target.files;
    count = files.length;
    console.log(count);

    // add the images into array
    for (let i = 0; i < count; i++) {
      selectedFiles.push(files[i]);
    }
    console.log("selected files:", selectedFiles);

    // add the images in array which is get from the server
    const arrr = [...inputData.images];

    // Check if the combined size exceeds the maximum size
    const totalSelectedFilesSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);
    const totalSeletedImagesSize = selectedImages.reduce((acc, file) => acc + file.size, 0);
    const totalSize = totalSelectedFilesSize + totalSeletedImagesSize;
    const maxSizeBytes = maxSize * 1024 * 1024; // Convert maxSize to bytes

    if (totalSize > maxSizeBytes) {
      alert(`Total size exceeds the maximum allowed size of ${maxSize} MB.`);
      // Clear the input value to prevent filenames from showing after an error
      e.target.value = "";
      selectedFiles = [];
      return;
    }

    // Check if the selected count exceeds the maximum allowed count
    if (files.length + arrr.length > maxCount) {
      alert(`You can select a maximum of ${maxCount} images.`);
      // Clear the input value to prevent filenames from showing after an error
      e.target.value = "";
      selectedFiles = [];
      return;
    }

    // call the function to convert the selected images to a string
    await image_to_base(selectedFiles);

    // call the delay function
    await timeout(1000);

    // concat the array of images get from the server and from input
    console.log("arrr", arrr);
    console.log("imgs", imgs);
    var finalArray = imgs.concat(arrr);
    console.log("finalArray", finalArray);

    // set the base64 strings into inputdata images to upload on server
    setInputData(() => ({
      ...inputData,
      images: finalArray,
    }));

    // Update state with selected images
    setSelectedImages((prev) => [...prev, ...selectedFiles]);
  };

  // function to delete the images from the preview whic is get from the server and also update the array
  const handleImageDeleted = (index) => {
    // Create a copy of the array and remove the selected image
    const updatedImages = [...inputData.images];
    updatedImages.splice(index, 1);
    // Update state with the modified array
    setInputData({ ...inputData, images: updatedImages });
  };

  // function to delete the images from the preview which is get from the input and also update the array
  const handleImageDelete = (index) => {
    // Create a copy of the array and remove the selected image
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    // Update state with the modified array
    setSelectedImages(updatedImages);
    // call the function to convert the updated images to a string for upload
    image_to_base(updatedImages);
    return false;
  };

  // function to handle the submit event
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if name and email fields are not empty
    if (!inputData.name.trim() || !inputData.email.trim()) {
      alert("Name and Email are required fields.");
      return;
    }

    // Check if email is valid
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (!inputData.email.match(isValidEmail)) {
      alert("Please enter a valid email");
      return;
    }

    // Check if images array is not empty
    if (inputData.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    // to send the data to the server
    await axios
      .put("http://localhost:3005/users/" + id, inputData)
      .then((res) => {
        alert("Data Updated Successfully!");
        navigate("/");
      });
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center">
      <div className="w-50 border bg-secondary text-white p-5">
        <div>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={inputData.name}
              onChange={(e) =>
                setInputData({ ...inputData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={inputData.email}
              onChange={(e) =>
                setInputData({ ...inputData, email: e.target.value })
              }
            />
          </div>
          <br />
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
                  onClick={() =>
                    selectedFiles.length !== 0
                      ? handleImageDelete(index)
                      : handleImageDeleted(index)
                  }
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
          </div>
          <br />
          <button className="btn btn-primary" onClick={handleSubmit}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Update;
