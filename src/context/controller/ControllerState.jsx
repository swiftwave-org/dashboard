/* eslint-disable react/prop-types */

import ControllerContext from "./ControllerContext";
import DomainController from "./_domainController";
import RedirectRulesController from "./_redirectRulesController";

const ControllerState = (props) => {
    const controllers =  {
        "redirect_rules": new RedirectRulesController(),
        "domains": new DomainController(),
    }

    // Return
    return (
        <ControllerContext.Provider value={controllers}>
            {props.children}
        </ControllerContext.Provider>
    )
}

export default ControllerState;