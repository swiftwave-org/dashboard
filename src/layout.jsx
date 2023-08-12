import { ServerConfig } from "./components/serverConfig";

// eslint-disable-next-line react/prop-types
export default function Layout({children}){
    return(
        <>
            {children}
            <ServerConfig />
        </>
    )
}