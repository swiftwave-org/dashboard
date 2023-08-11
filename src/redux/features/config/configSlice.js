import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'config',
  initialState: {
    server: {
        set: localStorage.getItem('server_set') || false,
        ip : localStorage.getItem('server_ip') || "",
        port : localStorage.getItem('server_port') || "",
    }
  },
  reducers: {
    setSeverConfig: (state, action) => {
        if(action.payload.ip === undefined || action.payload.port === undefined){
            return;
        }
        state.server.set = true;
        state.server.ip = action.payload.ip;
        state.server.port = action.payload.port;
        // update local storage
        localStorage.setItem('server_set', true);
        localStorage.setItem('server_ip', action.payload.ip);
        localStorage.setItem('server_port', action.payload.port);
    },
  }
})

// Action creators are generated for each case reducer function
export const { setSeverConfig } = authSlice.actions

export default authSlice.reducer