import React from "react";
// import { useLocation } from "react-router-dom";
import "./Page404.css";

function Page404() {
  return (
    <div className="error-page-container">
      <div className="img-cont">
        <img src="assets/image.png" alt="" />
      </div>
      <div className="error-msg-container">
        <h1> Oops Something went wrong !</h1>
        <p>Please Try Again Later</p>
        <br />
        <button onClick={() => window.location.reload()} type="reset">
          Try Again
        </button>
      </div>
    </div>
  );
}

export default Page404;
