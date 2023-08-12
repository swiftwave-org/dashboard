/* eslint-disable react/prop-types */

import ControllerContext from "./ControllerContext";
import DomainController from "./_domainController";
import GitCredentialsController from "./_gitCredentialsController";
import RedirectRulesController from "./_redirectRulesController";

const ControllerState = (props) => {
    const controllers =  {
        "redirect_rules": new RedirectRulesController(),
        "domains": new DomainController(),
        "git_credentials": new GitCredentialsController(),
    }

    // Return
    return (
        <ControllerContext.Provider value={controllers}>
            {props.children}
        </ControllerContext.Provider>
    )
}

export default ControllerState;