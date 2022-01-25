import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import AllUsers from "./pages/AllUsers";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageContainer from "./components/PageContainer/PageContainer";
import { useFlash } from "./context/useFlash";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import NewUser from "./pages/NewUser";
import Details from "./pages/Details";

function App() {
  const [userAuth, setUserAuth] = useState({
    isAuth: false,
    admin_id: "",
    token: "",
    admin_name: "",
    expiresIn: "",
  });

  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("adminData")) {
      setUserAuth({
        isAuth: false,
        admin_id: "",
        token: "",
        admin_name: "",
        expiresIn: "",
      });
      return;
    }

    const adminData = JSON.parse(localStorage.getItem("adminData"));

    setUserAuth({
      isAuth: true,
      admin_id: adminData.admin_id,
      admin_name: adminData.admin_name,
      token: adminData.token,
      expiresIn: adminData.expiresIn,
    });
  }, []);

  const handleSignup = (e, p) => {
    fetch("http://localhost:4000/admin/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(p),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setFlash({
          message: resData.message,
          state: resData.state,
        });
        if (resData.state === 1) {
          navigate("/login", { replace: true });
        }
      })
      .catch((err) => {
        setFlash({ message: " 😞 Something went wrong ", state: -1 });
      });
  };

  const handleLogin = (e, p) => {
    setUserAuth({
      isAuth: false,
      admin_id: "",
      admin_name: "",
      token: "",
      expiresIn: "",
    });

    fetch("http://localhost:4000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(p),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.state === undefined) {
          const adminData = {
            isAuth: true,
            token: resData.admin_token,
            admin_id: resData.admin_id,
            admin_name: resData.admin_name,
            expiresIn: resData.expiresIn,
          };
          setUserAuth(adminData);
          localStorage.setItem("adminData", JSON.stringify(adminData));
          localStorage.setItem("userData", JSON.stringify({ user_id: "" }));
          navigate("/", { replace: true });
        } else {
          setFlash({
            message: resData.message,
            state: resData.state,
          });
          if (resData.state === -1) {
            setUserAuth({
              isAuth: false,
              token: "",
              admin_id: "",
              admin_name: "",
              expiresIn: "",
            });
            localStorage.removeItem("adminData");
            localStorage.setItem("userData", JSON.stringify({ user_id: "" }));
          }
        }
      })
      .catch((err) => {
        setFlash({ message: " 😞 Something went wrong!", state: -1 });
        localStorage.removeItem("adminData");
        localStorage.setItem("userData", JSON.stringify({ user_id: "" }));
        setUserAuth({
          isAuth: false,
          token: "",
          admin_id: "",
          admin_name: "",
          expiresIn: "",
        });
      });
  };

  const handleLogout = () => {
    setUserAuth({
      isAuth: false,
      admin_id: "",
      admin_name: "",
      token: "",
      expiresIn: "",
    });
    localStorage.removeItem("adminData");
    localStorage.setItem("userData", JSON.stringify({ user_id: "" }));
    setFlash({ message: " 👍 Logged out successfully", state: 1 });
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (userAuth.expiresIn) {
      const timeRemaining =
        new Date(userAuth.expiresIn).getTime() - new Date().getTime();
      if (timeRemaining < 1) {
        handleLogout();
        navigate("/login", { replace: true });
        return;
      }
      autoLogout(timeRemaining);
    }
  }, [handleLogin]);

  const autoLogout = (duration) => {
    setTimeout(() => {
      handleLogout();
      navigate("/login", { replace: true });
    }, duration);
  };

  if (!localStorage.getItem("userData")) {
    handleLogout();
    navigate("/login", { replace: true });
  }

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  const [userControlsMode, setUserControlsMode] = useState();

  const handleControls = (e, p) => {
    if (e.target.id === "edit") {
      if (!userAuth.isAuth) {
        setFlash({ message: " ⚠️ Please Login to continue ... ", state: -1 });
      }
    }
    setUserControlsMode(e);
    setUserData(p);
    localStorage.setItem("userData", JSON.stringify(p));
  };

  useEffect(() => {
    setUserData(JSON.parse(localStorage.getItem("userData")));
  }, [userControlsMode]);

  const [flash, setFlash] = useState({ message: null, state: 0 });
  const value = { flash, setFlash };

  return (
    <div className="App">
      <useFlash.Provider value={value}>
        <Navigation
          isLoggedIn={userAuth.isAuth}
          admin_name={userAuth.admin_name}
          handleLogout={handleLogout}
        />
        <div id="main-container">
          <PageContainer
            config={{
              message: flash.message,
              style: { ...flash }.state
                ? {
                    animation: "flash 2.6s 0s ease",
                    backgroundColor:
                      { ...flash }.state > 0
                        ? "rgba(3, 167, 167, 0.315)"
                        : "rgba(252, 45, 124, 0.315)",
                    color:
                      { ...flash }.state > 0
                        ? "rgb(0, 36, 39)"
                        : "rgba(252, 45, 124, 0.315)",
                  }
                : {
                    visibility: "hidden",
                  },
            }}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <AllUsers
                    userAuth={userAuth}
                    handleControls={(e, p) => handleControls(e, p)}
                  />
                }
              />
              <Route
                path="/add"
                element={
                  <NewUser
                    token={userAuth.token}
                    config={{
                      buttonName: "Create",
                      mode: "new",
                      userInfo: {
                        user_name: "",
                        user_email: "",
                        user_password: "",
                        total_orders: "",
                      },
                    }}
                  />
                }
              />
              <Route
                path={`/edit/${userData.user_id}`}
                element={
                  <NewUser
                    token={userAuth.token}
                    config={{
                      buttonName: "Update",
                      mode: "edit",
                      userInfo: userData,
                    }}
                  />
                }
              />
              <Route
                path={`/details/${userData.user_id}`}
                element={<Details userInfo={userData} />}
              />
              <Route
                path="/login"
                element={<Login handleLogin={(e, p) => handleLogin(e, p)} />}
              />
              <Route
                path="/signup"
                element={<Signup handleSignup={(e, p) => handleSignup(e, p)} />}
              />
              <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
          </PageContainer>
        </div>
      </useFlash.Provider>
    </div>
  );
}

export default App;
