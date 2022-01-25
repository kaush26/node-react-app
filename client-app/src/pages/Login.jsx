import React, { useRef } from "react";
import "./Login.css";

function Login(props) {
  const emailRef = useRef();
  const passRef = useRef();

  return (
    <div className="container login">
      <div className="image-container">
        <h1>Login</h1>
      </div>
      <div className="form-container">
        <label htmlFor="email">email-ID </label>
        <input
          type="email"
          name="admin_email"
          id="email"
          placeholder="your email"
          ref={emailRef}
        />
        <label htmlFor="password">password </label>
        <input
          type="password"
          name="admin_password"
          id="password"
          placeholder="your password"
          ref={passRef}
        />
        <button
          onClick={(e) =>
            props.handleLogin(e, {
              admin_email: emailRef.current.value,
              admin_password: passRef.current.value,
            })
          }
          className="btn"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
