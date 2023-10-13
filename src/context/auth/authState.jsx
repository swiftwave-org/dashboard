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
      // TODO
      setTimeout(() => {
        setAuthenticated(true);
      }, 1000);
    } else {
      setAuthenticated(false);
    }
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

  // Verrify authentication status and logout if session timed out
  const logoutIfSessionTimedout = async() => {
    if(localStorage.getItem("token") === null) {
      return;
    }
    var config = {
      method: "post",
      url: route.AUTH_VERIFY,
    };

    try {
      let res = await axios(config);
      if(res.status !== 200) {
        throw new Error("Not authenticated");
      }
    } catch (error) {
      console.error(error);
      logout();      
    }
  }

  // Generate websocket token
  const generateWebsocketToken = async () => {
    // TODO: error notification
    var config = {
      method: "get",
      url: route.AUTH_WEBSOCKET_TOKEN,
    };

    try {
      let res = await axios(config);
      if(res.status !== 200) {
        return null;
      }
      return res.data.token;
    } catch (error) {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  }
  
  return (
    <AuthContext.Provider
      value={{
        state,
        isAuthenticated,
        verifyAuthenticationStatus,
        authenticate,
        recoverToken,
        logout,
        logoutIfSessionTimedout,
        generateWebsocketToken
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
