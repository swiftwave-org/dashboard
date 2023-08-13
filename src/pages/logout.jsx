import { useContext, useEffect } from "react";
import AuthContext from "../context/auth/authContext";

export default function LogoutPage(){
  const authContext = useContext(AuthContext);

  useEffect(()=>{
    authContext.logout();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <>
      <div>
        Logging out..
      </div>
    </>
  );
}