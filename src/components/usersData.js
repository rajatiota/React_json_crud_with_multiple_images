import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CSVLink } from "react-csv";
import ReactPaginate from 'react-paginate';

const UsersData = () => {
  // use state is used to set the incoming data to show the users
  const [data, setData] = useState([]);
  // navigate is used to navigate to desired location
  const navigate = useNavigate();
  var count = 0;

  // use state for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const itemsPerPage = 4;
  

  // useeffect is used to get the data from the json server
  useEffect(() => {
    axios
      .get("http://localhost:3005/users")
      .then((res) => { 
        setData(res.data)
        setTotalPages(Math.ceil(res.data.length / itemsPerPage))})
      .catch((err) => console.log(err));
  }, []);


const startIndex = currentPage * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const subset = data.slice(startIndex, endIndex);


const handlePageChange = (selectedPage) => {
  setCurrentPage(selectedPage.selected);
};


  return (
    <div className="container">
      <h1>List Of Users Data</h1>
      <Link to="/create" className="btn btn-success my-3">
        Add User
      </Link>
      <button className='btn btn-info' style={{float:'right'}} >
      <CSVLink data={data}><i className="fa-solid fa-download text-white"></i></CSVLink>
      </button>
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
          {subset.map((users, index) => (
            <tr key={index}>
              <th>{(count += 1)}</th>
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
      <div>
    {subset.map((item) => (
        <div key={item.id}>{item.title}</div>
    ))}
    <ReactPaginate
        pageCount={totalPages}
        onPageChange={handlePageChange}
        forcePage={currentPage}
        previousLabel={"<<"}
        nextLabel={">>"}
        breakLabel={"..."}
        containerClassName={"pagination-container"}
        activeLinkClassName={"active-page"}
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
    />
    </div>
    </div>
  );
  

  // function for delete the user
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
