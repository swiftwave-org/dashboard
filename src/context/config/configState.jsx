/* eslint-disable react/prop-types */

import { useState } from "react";
import ConfigContext from "./configContext";
import axios from "axios";

const ConfigState = (props) => {
  const initialState = localStorage.getItem("config")
    ? JSON.parse(localStorage.getItem("config"))
    : {
        server: {
          host: "",
          port: "",
        },
      };
  const [state, setState] = useState(initialState);

  // Functions

  // Set the server host and port
  const setServer = (host, port) => {
    var newState = {
      ...state,
      server: {
        host: host,
        port: port,
      },
    };
    setState(newState);
    localStorage.setItem("config", JSON.stringify(newState));

  };

  // Check if the server host and port are set
  const isSet = () => {
    return state.server.host !== "" && state.server.port !== "";
  };

  // Get the server host and port
  const setURI = () => {
      let baseURL = state.server.host + ":" + state.server.port;
      axios.defaults.baseURL = "http://"+baseURL;
  };

  // Get websocket URI
  const getWebsocketURI = () => {
    let baseURL = state.server.host + ":" + state.server.port;
    return "ws://"+baseURL;
  };

  // Set default axios config
  setURI()

  // Return
  return (
    <ConfigContext.Provider value={{ state, setServer, isSet, getWebsocketURI }}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export default ConfigState;
