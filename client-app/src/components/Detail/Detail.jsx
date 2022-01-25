import React from "react";
import Row from "./Row";
import { urlParser } from "../../utils/ImageURLParser";
import "./Detail.css";

function Detail(props) {
  const user = props.user;
  return (
    <div className="main-container">
      <div className="user-image-container">
        <a href={urlParser(user.user_image)}>
          <img src={urlParser(user.user_image)} alt="user's image" />
        </a>
      </div>
      <div className="info-container">
        <div className="id-container">
          <h1>
            ID# : <span>{user.user_id}</span>
          </h1>
        </div>
        <Row _key={"Name"} value={user.user_name} />
        <Row _key={"Email address"} value={user.user_email} />
        <Row _key={"Number of Orders"} value={user.total_orders} />
        <Row _key={"Password"} value={user.user_password} />
        <Row
          _key={"Last Logged In"}
          value={
            user.last_logged_in
              ? new Date(user.last_logged_in).toLocaleString()
              : "NA"
          }
        />
        <Row
          _key={"Created At"}
          value={new Date(user.created_at).toLocaleString()}
        />
        <Row
          _key={"Updated At"}
          value={new Date(user.updatedAt).toLocaleString()}
        />
      </div>
    </div>
  );
}

export default Detail;
