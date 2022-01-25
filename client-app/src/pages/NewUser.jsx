import React, { useEffect, useContext, useReducer } from "react";
import { useFlash } from "../context/useFlash";
import "./NewUser.css";
import { useNavigate } from "react-router-dom";

const reducer = (state, action) => {
  let value;
  if (action.event !== null) {
    value = action.event.target.value;
  }
  switch (action.type) {
    case "name":
      return { name: value };
    case "email":
      return { email: value };
    case "password":
      return { password: value };
    case "orders":
      return { totalOrders: value };
    case "reset":
      return {
        name: "",
        email: "",
        password: "",
        totalOrders: "",
      };
    default:
      throw new Error();
  }
};

function NewUser(props) {
  const userInfo = props.config.userInfo;
  const token = props.token;

  const { flash, setFlash } = useContext(useFlash);

  let initialValue = {
    name: userInfo.user_name,
    email: userInfo.user_email,
    password: userInfo.user_password,
    totalOrders: userInfo.total_orders,
  };

  const [field, dispatch] = useReducer(reducer, initialValue);

  useEffect(() => {
    if (props.config.mode === "new") {
      dispatch({ type: "reset", event: null });
    }
  }, [userInfo]);

  let navigate = useNavigate();

  const submitUser = (e) => {
    const parent = e.target.parentElement.children;

    const datas = {
      user_name: parent[1].value,
      user_email: parent[3].value,
      user_password: parent[5].value,
      total_orders: parent[7].value,
      user_image: parent[9].children[0].files[0],
    };

    const formData = new FormData();
    formData.append("user_name", datas.user_name);
    formData.append("user_email", datas.user_email);
    formData.append("user_password", datas.user_password);
    formData.append("total_orders", datas.total_orders);
    formData.append("user_image", datas.user_image);

    switch (props.config.mode) {
      case "new":
        fetch("http://localhost:4000/admin/insert", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((resData) => {
            setFlash({ message: resData.message, state: resData.state });
            if (resData.state > 0) {
              navigate("/", { replace: true });
            }
          })
          .catch((err) => {
            setFlash({ message: " ⚠️ Insertion Failed !", state: -1 });
          });
        break;
      case "edit":
        formData.append("user_id", userInfo.user_id);
        fetch(`http://localhost:4000/admin/update`, {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((resData) => {
            console.log("resData = ", resData);
            setFlash({ message: resData.message, state: resData.state });
            if (resData.state > 0) {
              navigate("/", { replace: true });
            }
          })
          .catch((err) => {
            setFlash({ message: " ⚠️ Update Failed !", state: -1 });
          });
        break;
      default:
        throw new Error("Something wrong with the switch- case mode(edit/new)");
    }
  };

  return (
    <div className="add-page-container">
      <div className="new-user-container">
        <div className="new-user-form-container">
          <label htmlFor="name">user name </label>
          <input
            type="text"
            name="user_name"
            id="name"
            placeholder="user name"
            value={field.name}
            onChange={(e) => dispatch({ type: "name", event: e })}
          />
          <label htmlFor="email">email-ID </label>
          <input
            type="email"
            name="user_email"
            id="email"
            placeholder="user email"
            value={field.email}
            onChange={(e) => dispatch({ type: "email", event: e })}
          />
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="user_password"
            id="password"
            placeholder="user password"
            value={field.password}
            onChange={(e) => dispatch({ type: "password", event: e })}
          />
          <label htmlFor="total-orders">total orders</label>
          <input
            type="number"
            name="user_total_orders"
            id="total-orders"
            placeholder="total orders"
            value={field.totalOrders}
            onChange={(e) => dispatch({ type: "orders", event: e })}
          />
          <label htmlFor="user_image">image </label>
          <div className="file-container">
            <input type="file" name="user_image" id="image" />
          </div>
          <button
            onClick={(e) => submitUser(e)}
            type="submit"
            className="user-btn"
          >
            {props.config.buttonName}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewUser;
