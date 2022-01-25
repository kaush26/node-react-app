import React, { useContext, useEffect } from "react";
import { useFlash } from "../../context/useFlash";
import "./PageContainer.css";

function PageContainer(props) {
  const config = props.config;

  const { flash, setFlash } = useContext(useFlash);

  useEffect(() => {
    let id = setTimeout(() => {
      setFlash({ message: null, state: 0 });
    }, 2600);
    return () => {
      clearTimeout(id);
    };
  }, [flash.state]);

  return (
    <div className="page-container">
      <div style={config.style} className="message-container">
        <span>{config.message}</span>
      </div>
      {props.children}
    </div>
  );
}

export default PageContainer;
