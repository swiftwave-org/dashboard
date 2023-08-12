/* eslint-disable react/prop-types */
import AuthContext from "./authContext";

const AuthState = (props) => {
    const state= {
        "isAuthenticated": false
    }
    return (
        <AuthContext.Provider value={state}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState;