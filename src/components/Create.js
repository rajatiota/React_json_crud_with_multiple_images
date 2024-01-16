import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Create = () => {
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
  const image_to_base = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(arr[i]);
      reader.onload = () => {
        // add base64 strings into imgs array
        imgs.push(reader.result);
      };
    }

    // set the base64 strings into inputdata images to upload on server
    setInputData(() => ({
      ...inputData,
      images: imgs,
    }));
  };

  // handle images change is used to handle the input images
  const handleImageChange = (e) => {
    const files = e.target.files;
    count = files.length;
    console.log(count);

    // add the images into array
    for (let i = 0; i < count; i++) {
      selectedFiles.push(files[i]);
    }
    console.log("selected files:", selectedFiles);

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
    if (selectedFiles.length + selectedImages.length > maxCount) {
      alert(`You can select a maximum of ${maxCount} images.`);
      // Clear the input value to prevent filenames from showing after an error
      e.target.value = "";
      selectedFiles = [];
      return;
    }

    // Update state with selected images
    setSelectedImages((prev) => [...prev, ...selectedFiles]);

    var finalArray = selectedFiles.concat(selectedImages);

    // call the function to convert the selected images to a string
    image_to_base(finalArray);
  };

  // function to delete the images from the preview and also update the array
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
    try {
      const response = await axios.post(
        "http://localhost:3005/users",
        inputData
      );

      console.log(response.data);
      alert("Data Posted Successfully!");
      // navigate to home page
      navigate("/");
    } catch (error) {
      console.log("Error posting data:", error);
      alert("Error posting data. Check console for details.");
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center">
      <div className="w-50 border bg-secondary text-white p-5">
        <div>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="form-control"
              onChange={(e) =>
                setInputData({ ...inputData, name: e.target.value })
              }
            />
          </div>
          <br />
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="form-control"
              onChange={(e) =>
                setInputData({ ...inputData, email: e.target.value })
              }
            />
          </div>
          <br />
          <div>
            <label htmlFor="email">Update Image:</label>
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
            {selectedImages.map((file, index) => (
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
            ))}
          </div>
          <br />
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
