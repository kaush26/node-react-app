import React from "react";

function Row(props) {
  return (
    <div className="row-container">
      <div className="key-container">
        <span>{props._key}</span>
      </div>
      <div className="value-container">
        <span>{props.value}</span>
      </div>
    </div>
  );
}

export default Row;
