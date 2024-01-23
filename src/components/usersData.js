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
  const [itemsPerPage, seitemsPerPage] = useState(4);

  // useeffect is used to get the data from the json server
  useEffect(() => {
    axios
      .get("http://localhost:3005/users")
      .then((res) => {
        setData(res.data);
        setTotalPages(Math.ceil(res.data.length / itemsPerPage));
      }) // set total pages
      .catch((err) => console.log(err));
  }, [itemsPerPage]);

  //sort the data to display 
  const sortedData = data.sort(function (a, b) {
    return a.orderno - b.orderno;
  });
  const startIndex = currentPage * itemsPerPage; // calculate start index
  const endIndex = startIndex + itemsPerPage; // calculate end index
  const subset = sortedData.slice(startIndex, endIndex); //  calculate data from start and end indexs

  const [newData, setNewData] = useState([]); // Initialize with the current order
  var count = currentPage * itemsPerPage;
  // handle pagechange for set the current page
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  // handle item per page
  function handleCount(e) {
    if (e.target.value !== "") seitemsPerPage(e.target.value);
  }

  //function for download table data in csv format
  const downloadCSV = () => {
    const csvContent = `Name,Email\n${data
      .map((user) => `${user.name},${user.email}`)
      .join("\n")}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "user_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  };

  // function delay is useed to delay the next opertation
  // function timeout(delay) {
  //   return new Promise((res) => setTimeout(res, delay));
  // }

  // function for drag and drop handling
  var row;
  var dragStartIndex;
  function start(event,index) {
    // console.log(event);
    row = event.target;
    dragStartIndex = index + 1; 
    console.log('dragStartIndex',dragStartIndex)   
  }

  function dragover(e) {
    e.preventDefault();

    let children = Array.from(e.target.parentNode.parentNode.children);
    if (children.indexOf(e.target.parentNode) > children.indexOf(row))
      e.target.parentNode.after(row);
    else e.target.parentNode.before(row);
  }

  // handle the drop fuction in table 
  const handleOnDrop = (event) => {
    event.preventDefault();
    const draggedRow = event.target.parentNode;
    // const draggedRowId = draggedRow.getAttribute("id");
    const draggedRowIndex = draggedRow.rowIndex;
   console.log('dragEndIndex',draggedRowIndex)
    // Assuming that each cell in the row has attributes for 'id', 'name', 'email', 'orderno'
    const draggedRowData = {
      id: draggedRow.getAttribute("id"),
      name: draggedRow.getAttribute("name"),
      email: draggedRow.getAttribute("email"),
      orderno: draggedRow.getAttribute("orderno"),
    };

    // Update the data in a way that suits your structure
    const updatedData = data.map((user) => {
      if (user.id === draggedRowData.id) {
        return {
          ...user,
          orderno: draggedRowIndex,
        };
      }
      var newOrderNo;
      if(draggedRowIndex < dragStartIndex) {
        newOrderNo  =  user.orderno < draggedRowIndex ? user.orderno
        :  user.orderno >= dragStartIndex ? user.orderno
        :  user.orderno + 1;
      }
      else if(draggedRowIndex > dragStartIndex){
        newOrderNo  =  user.orderno < dragStartIndex ? user.orderno
        :  user.orderno > dragStartIndex && user.orderno <= draggedRowIndex  ? user.orderno - 1
        :  user.orderno;
      }
        

      return {
        ...user,
        orderno: newOrderNo,
      };
    });

    setNewData(updatedData);
  };

  const hadleOrder = async () => {
    try {
      for (const row of newData) {
        await axios.put(`http://localhost:3005/users/${row.id}`, {
          ...row,
          orderno: row.orderno,
        });
      }

      alert("Order Updated Successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating order on the server:", error);
      // Display an error message to the user
    }
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
          style={{ float: "right", margin: "16px 0px" }}
          onClick={downloadCSV}
        >
          <i className="fa-solid fa-download text-white"></i>
        </button>
        {/* csvlink is used to download the csv file which includes the the table data */}
        {/* <CSVLink data={data}>
            <i className="fa-solid fa-download text-white"></i>
          </CSVLink> */}
      </div>
      <table className="table" id="mytable">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="tbody_id">
          {subset.map((users, index) => (
            <tr
              key={index}
              id={users.id}
              draggable="true"
              onDragStart={(e) => start(e,index)}
              onDragOver={dragover}
              onDrop={handleOnDrop}
              attr={users.id}
              order={users.orderno}
            >
              <th>{count += 1}</th>
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
        <div className="set-count">
          <div className="d-flex row m-0">
            <h6 style={{ marginRight: "5px" }}>Item Per Page</h6>
            <select id="count" name="count" onChange={handleCount}>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="12">12</option>
            </select>
          </div>
          <button style={{ float: "right" }} onClick={hadleOrder}>
            Save order
          </button>
        </div>
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
