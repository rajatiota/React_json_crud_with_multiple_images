import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

const UsersData = () => {
  // use state is used to set the incoming data to show the users
  const [data, setData] = useState([]);
  // navigate is used to navigate to desired location
  const navigate = useNavigate();

  // use state for current page in pagination
  const [currentPage, setCurrentPage] = useState(0);
  // use state for tital pages in pagination
  const [totalPages, setTotalPages] = useState(0);

  const itemsPerPage = 4;

  var count = currentPage * itemsPerPage;
  // useeffect is used to get the data from the json server
  useEffect(() => {
    axios
      .get("http://localhost:3005/users")
      .then((res) => {
        setData(res.data);
        setTotalPages(Math.ceil(res.data.length / itemsPerPage));
      }) // set total pages
      .catch((err) => console.log(err));
  }, []);

  const startIndex = currentPage * itemsPerPage; // calculate start index
  const endIndex = startIndex + itemsPerPage; // calculate end index
  const subset = data.slice(startIndex, endIndex); //  calculate data from start and end indexs

  // handle pagechange for set the current page
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const downloadCSV = () => {
    const csvContent = `Name,Email\n${data.map(user => `${user.name},${user.email}`).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

  return (
    <div className="container">
      <h1 style={{ margin: "10px" }}>List Of Users Data</h1>
      <div>
        <Link to="/create" className="btn btn-success my-3">
          Add User
        </Link>
        <button
          className="btn btn-info"
          style={{ float: "right", margin: "16px 0px" }} onClick={downloadCSV}
        ><i className="fa-solid fa-download text-white"></i>
        </button>
         {/* csvlink is used to download the csv file which includes the the table data */}
          {/* <CSVLink data={data}>
            <i className="fa-solid fa-download text-white"></i>
          </CSVLink> */}
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>S.no</th>
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
