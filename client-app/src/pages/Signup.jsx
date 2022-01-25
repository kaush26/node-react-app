import React, { useRef } from "react";
import "./Signup.css";

function Signup(props) {
  const nameRef = useRef();
  const emailRef = useRef();
  const passRef = useRef();
  const confPassRef = useRef();

  return (
    <div className="container signup">
      <div className="image-container">
        <h1>Sign Up</h1>
      </div>
      <div className="form-container signup">
        <label htmlFor="email">name </label>
        <input
          type="text"
          name="admin_name"
          id="name"
          placeholder="name"
          ref={nameRef}
        />
        <label htmlFor="email">email-ID </label>
        <input
          type="email"
          name="admin_email"
          id="email"
          placeholder="email"
          ref={emailRef}
        />
        <label htmlFor="password">password </label>
        <input
          type="password"
          name="admin_password"
          id="password"
          placeholder="password"
          ref={passRef}
        />
        <label htmlFor="password">confirm password </label>
        <input
          type="password"
          name="admin_confirmPassword"
          id="confirm-password"
          placeholder="confirm password"
          ref={confPassRef}
        />
        <button
          onClick={(e) =>
            props.handleSignup(e, {
              admin_name: nameRef.current.value,
              admin_email: emailRef.current.value,
              admin_password: passRef.current.value,
              admin_confirmPassword: confPassRef.current.value,
            })
          }
          className="btn"
        >
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;
