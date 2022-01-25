import React, { useContext, useRef } from "react";
import { useFlash } from "../../context/useFlash";
import { Link } from "react-router-dom";
import "./Table.css";

function TableItems(props) {
  const user = props.user;
  const token = props.userAuth.token;

  const deleteBtnRef = useRef();
  const editRef = useRef();

  const handleMouseEnter = (e) => {
    if (!props.userAuth.isAuth) {
      return;
    }
    if (e.target.id === "edit-btn" || e.target.id === "edit") {
      return (editRef.current.style.backgroundColor = "#5d0680");
    }
    if (e.target.id === "delete-btn" || e.target.id === "delete") {
      return (deleteBtnRef.current.style.backgroundColor = "crimson");
    }
  };
  const handleMouseLeave = (e) => {
    if (!props.userAuth.isAuth) {
      return;
    }
    if (e.target.id === "edit-btn" || e.target.id === "edit") {
      return (editRef.current.style.backgroundColor =
        "rgba(128, 0, 128, 0.795)");
    }
    if (e.target.id === "delete-btn" || e.target.id === "delete") {
      return (deleteBtnRef.current.style.backgroundColor = "rgb(255, 86, 120)");
    }
  };

  const { flash, setFlash } = useContext(useFlash);

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/admin/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setFlash({
          message: resData.message,
          data: resData.data,
          state: resData.state,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let i = 0;

  return (
    <tr key={i++}>
      <td>{user.user_id}</td>
      <td>{user.user_name}</td>
      <td>{user.user_email}</td>
      <td className="controls">
        <li id="detail-btn">
          <Link
            onClick={(e) => props.handleControls(e, { ...user })}
            to={`/details/${user.user_id}`}
          >
            details
          </Link>
        </li>
        <li
          id="edit-btn"
          ref={editRef}
          onMouseEnter={(e) => handleMouseEnter(e)}
          onMouseLeave={(e) => handleMouseLeave(e)}
          style={{
            backgroundColor: props.userAuth.isAuth
              ? "rgba(128, 0, 128, 0.795)"
              : "#a2a2a2",
          }}
        >
          <Link
            id="edit"
            onClick={(e, p) => props.handleControls(e, { ...user })}
            to={props.userAuth.isAuth ? `/edit/${user.user_id}` : "/"}
          >
            edit
          </Link>
        </li>
        <li
          id="delete-btn"
          ref={deleteBtnRef}
          onMouseEnter={(e) => handleMouseEnter(e)}
          onMouseLeave={(e) => handleMouseLeave(e)}
          style={{
            backgroundColor: props.userAuth.isAuth
              ? "rgb(255, 86, 120)"
              : "#a2a2a2",
          }}
        >
          <Link
            id="delete"
            onClick={() => handleDelete(user.user_id)}
            to={props.userAuth.isAuth ? `/delete/${user.user_id}` : "/"}
          >
            delete
          </Link>
        </li>
      </td>
    </tr>
  );
}

export default TableItems;
