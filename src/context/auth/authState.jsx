/* eslint-disable react/prop-types */
import { useState } from "react";
import AuthContext from "./authContext";
import axios from "axios";
import route from "../../config/route";
import qs from "qs";

const AuthState = (props) => {
  // Initial state
  const initialState = {
    isAuthenticated: false,
  };

  // States
  const [state, setState] = useState(initialState);

  // Functions
  const isAuthenticated = () => {
    return state.isAuthenticated;
  };
  const setAuthenticated = (value) => {
    setState({
      ...state,
      isAuthenticated: value,
    });
  };

  // Recover token
  const recoverToken = () => {
    const token = localStorage.getItem("token");
    if (token !== null) {
      axios.defaults.headers.common["authorization"] = token;
    }
    setAuthenticated(true);
  };

  // Authenticate the user
  const authenticate = async (username, password) => {
    var data = qs.stringify({
      username: username,
      password: password,
    });
    var config = {
      method: "post",
      url: route.AUTH_LOGIN,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    try {
      const res = await axios(config);
      var resBody = res.data;
      if (res.status === 200) {
        setAuthenticated(true);
        axios.defaults.headers.common["authorization"] = resBody.token;
        localStorage.setItem("token", resBody.token);
        return {
          status: true,
          message: resBody.message,
        };
      }
    } catch (error) {
      const res = error.response;
      if (res.status === 401) {
        const resBody = res.data;
        // Invalid credentials
        setAuthenticated(false);
        return {
          status: false,
          message: resBody.message,
        };
      } else {
        // Server error
        setAuthenticated(false);
        return {
          status: false,
          message: "Server error",
        };
      }
    }
  };

  // Verify and update the authentication status
  const verifyAuthenticationStatus = () => {
    var config = {
      method: "post",
      url: route.AUTH_VERIFY,
    };

    axios(config)
      .then(function (response) {
        if (response.status == 200) {
          console.log("Authenticated");
          setAuthenticated(true);
        } else {
          console.log("Not Authenticated");
          setAuthenticated(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setAuthenticated(false);
      });
  };
  
  return (
    <AuthContext.Provider
      value={{
        state,
        isAuthenticated,
        verifyAuthenticationStatus,
        authenticate,
        recoverToken
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
