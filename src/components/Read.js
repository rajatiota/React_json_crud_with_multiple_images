import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Lightbox from "react-awesome-lightbox";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";

const Read = () => {
  // useparam is used to get the id from the url parameter
  const { id } = useParams();

  // initialize inputState with defalut structure to show data from json server
  const [Data, setData] = useState({
    name: "",
    email: "",
    images: [],
  });

  // initialize state for index
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // initialize state for open and clode lightbox
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  var url = [];
  // useeffect is used to get the data from the json server
  useEffect(() => {
    axios
      .get("http://localhost:3005/users/" + id)
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  url = Data.images;

  // function for open lightbox
  const openLightbox = (index) => {
    console.log("Opening lightbox for index:", index);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // function for close lightbox
  const closeLightbox = () => {
    console.log("Closing lightbox");
    setIsLightboxOpen(false);
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center">
      <div className="w-50 border bg-secondary text-white p-5">
        <h2 style={{margin:'10px 0px'}}>User Data</h2>
        <p>Name: {Data.name}</p>
        <p>Email: {Data.email}</p>
        <div>
          {Data.images.map((file, index) => (
            <div
              key={index}
              style={{ display: "inline-block", position: "relative" }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={file}
                alt={`Preview ${index + 1}`}
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  margin: "5px",
                  cursor: "pointer",
                }}
              />{" "}
              <br />
            </div>
          ))}
        </div>
        {isLightboxOpen && (
          <Lightbox
            images={url}
            startIndex={lightboxIndex}
            onClose={closeLightbox}
            isOpen={isLightboxOpen}
          />
        )}
        <Link className="btn btn-info text-white"  to="/">
          Back
        </Link>
      </div>
    </div>
  );
};

export default Read;
