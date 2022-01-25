import React from "react";
import Detail from "../components/Detail/Detail";

function Details(props) {
  const user = props.userInfo;
  return (
    <React.Fragment>
      <div className="detail-container">
        <h1 className="detail-head">User's Detail</h1>
        <Detail user={user} />
      </div>
    </React.Fragment>
  );
}

export default Details;
