import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Page404 from "./Page404";
import Table from "../components/Table/Table";
import "./AllUsers.css";

function AllUsers(props) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/admin/all-users", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((resData) => {
        setUsers([...resData]);
      })
      .catch((err) => {
        console.log("connection error= ", err);
        ReactDOM.render(<Page404 />, document.getElementById("main-container"));
      });
  }, []);

  return (
    <div className="all-users-container">
      <Table
        userAuth={props.userAuth}
        users={users}
        handleControls={props.handleControls}
      />
    </div>
  );
}

export default AllUsers;
