import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Login from "./pages/Login";
import PageContainer from "./components/PageContainer/PageContainer";
import HomePage from "./pages/HomePage";
import { useFlash } from "./context/useFlash";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

function App() {
  const [userAuth, setUserAuth] = useState({
    isAuth: false,
    user_id: "",
    token: "",
    user_name: "",
    expiresIn: "",
  });

  const [flash, setFlash] = useState({ message: null, state: 0 });
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("userData")) {
      setUserAuth({
        isAuth: false,
        user_id: "",
        token: "",
        user_name: "",
        expiresIn: "",
      });
      return handleLogout();
    }
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUserAuth({
      isAuth: true,
      user_id: userData.user_id,
      user_name: userData.user_name,
      token: userData.token,
      expiresIn: userData.expiresIn,
    });
  }, []);

  const handleLogin = (e, p) => {
    setUserAuth({
      isAuth: false,
      user_id: "",
      user_name: "",
      token: "",
      expiresIn: "",
    });
    fetch("http://localhost:4000/user/login", {
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
          const userData = {
            isAuth: true,
            token: resData.user_token,
            user_id: resData.user_id,
            user_name: resData.user_name,
            expiresIn: resData.expiresIn,
          };
          setUserAuth(userData);
          localStorage.setItem("userData", JSON.stringify(userData));
          navigate("/", { replace: true });
        } else {
          setFlash({
            message: resData.message,
            state: resData.state,
          });
          if (resData.state === -1) {
            localStorage.removeItem("userData");
            handleLogout();
          }
        }
      })
      .catch((err) => {
        setFlash({ message: " 😞 Something went wrong!", state: -1 });
        localStorage.removeItem("userData");
        setUserAuth({
          isAuth: false,
          token: "",
          user_id: "",
          user_name: "",
          expiresIn: "",
        });
      });
  };

  const handleLogout = () => {
    fetch("http://localhost:4000/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userAuth.user_id,
        last_logged_in: new Date().toISOString(),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.state === -1) {
          throw new Error();
        }
        setUserAuth({
          isAuth: false,
          user_id: "",
          user_name: "",
          token: "",
          expiresIn: "",
        });
        localStorage.removeItem("userData");
        setFlash({ message: resData.message, state: resData.state });
        navigate("/login", { replace: true });
      })
      .catch((err) => {
        setFlash({ message: " 😞 Something wwent wrong !" });
      });
  };
  useEffect(() => {
    if (userAuth.expiresIn) {
      const timeRemaining =
        new Date(userAuth.expiresIn).getTime() - new Date().getTime();
      if (timeRemaining < 1) {
        handleLogout();
        return;
      }
      autoLogout(timeRemaining);
    }
  }, [handleLogin]);

  const autoLogout = (duration) => {
    setTimeout(() => {
      handleLogout();
    }, duration);
  };

  const value = { flash, setFlash };

  return (
    <div className="App">
      <Navigation
        isLoggedIn={userAuth.isAuth}
        user_name={userAuth.user_name}
        handleLogout={handleLogout}
      />
      <div id="main-container">
        <useFlash.Provider value={value}>
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
                path="/login"
                element={<Login handleLogin={(e, p) => handleLogin(e, p)} />}
              />
              {console.log("isAuth = ", userAuth.isAuth)}
              <Route
                path="/"
                element={userAuth.isAuth ? <HomePage /> : <Login />}
              />
            </Routes>
          </PageContainer>
        </useFlash.Provider>
      </div>
    </div>
  );
}

export default App;
