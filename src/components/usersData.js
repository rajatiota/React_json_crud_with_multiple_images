import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UsersData = () => {

  // use state is used to set the incoming data to show the users
  const [data, setData] = useState([]);
  // navigate is used to navigate to desired location
  const navigate = useNavigate();
  var count = 0;

  // useeffect is used to get the data from the json server
  useEffect(() => {
    axios
      .get("http://localhost:3005/users")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <h1>List Of Users Data</h1>
      <Link to="/create" className="btn btn-success my-3">
        Add User
      </Link>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((users, index) => (
            <tr key={index}>
              <th>{count+=1}</th>
              <td>{users.name}</td>
              <td>{users.email}</td>
              <td>
                <div>
                  <Link
                    className="text-decoration-none btn btn-sm btn-info"
                    to={`/read/${users.id}`}
                  >
                    <i className="fa-regular fa-eye"></i>
                  </Link>
                  &nbsp;
                  <Link
                    className="text-decoration-none btn btn-sm btn-primary"
                    to={`/update/${users.id}`}
                  >
                    <i className="fa-regular fa-pen-to-square"></i>
                  </Link>
                  &nbsp;
                  <button
                    className="text-decoration-none btn btn-sm btn-danger"
                    onClick={(e) => handleDelete(users.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  &nbsp;
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function handleDelete(id) {
    const confirm = window.confirm("Are you sure you want to delete?");
    if (confirm) {
      axios.delete("http://localhost:3005/users/" + id).then((res) => {
        alert("Record Deleted");
        navigate("/");
      });
    }
  }
};
export default UsersData;
