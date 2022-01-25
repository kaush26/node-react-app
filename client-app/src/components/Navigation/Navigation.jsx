import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./Navigation.css";

const greetMessage = (time) => {
  if (time > 400 && time <= 1200) {
    return " 🌞 Good morning ";
  } else if (time > 1200 && time <= 1700) {
    return " 🌻 Good Afternoon ";
  } else if (time > 1700 && time <= 2000) {
    return " 🌇 Good evening ";
  } else {
    return " 🌠 Good night ";
  }
};

function Navigation(props) {
  const isLoggedIn = props.isLoggedIn;
  const date = new Date();
  const time = 100 * date.getHours() + date.getMinutes();
  const [greet, setGreet] = useState(greetMessage(time));

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let id = setInterval(() => {
      const date = new Date();
      const time = 100 * date.getHours() + date.getMinutes();
      setGreet(greetMessage(time));
    }, 1 * 60 * 1000);
    return () => {
      clearInterval(id);
    };
  });

  return (
    <div className="navigation-container">
      <ul className="list-container">
        <li
          onClick={() => navigate("/", { replace: true })}
          style={{ display: !isLoggedIn ? "none" : "block" }}
          className="list-items greetings"
        >
          <span>{greet}</span>
        </li>
        <li
          onClick={() => navigate("/", { replace: true })}
          style={{ display: !isLoggedIn ? "none" : "block" }}
          className="list-items admin-name"
        >
          <span>{props.admin_name}</span>
        </li>
        <li className="list-items all-user">
          <Link
            style={{ color: location.pathname === "/" ? "gold" : "white" }}
            to="/"
          >
            All Users
          </Link>
        </li>
        <li className="list-items add">
          <Link
            onClick={() => {
              <Navigate to="/add" />;
            }}
            style={{
              display: !isLoggedIn ? "none" : "block",
              color: location.pathname === "/add" ? "gold" : "white",
            }}
            to="/add"
          >
            Add
          </Link>
        </li>
        <li className="list-items login">
          <Link
            style={{
              display: isLoggedIn ? "none" : "block",
              color: location.pathname === "/login" ? "gold" : "white",
            }}
            to="/login"
          >
            Login
          </Link>
        </li>
        <li className="list-items signup">
          <Link
            style={{
              display: isLoggedIn ? "none" : "block",
              color: location.pathname === "/signup" ? "gold" : "white",
            }}
            to="/signup"
          >
            Signup
          </Link>
        </li>
        <li className="list-items logout">
          <button
            style={{
              display: !isLoggedIn ? "none" : "block",
            }}
            onClick={props.handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Navigation;
