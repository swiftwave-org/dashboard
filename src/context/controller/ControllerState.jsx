/* eslint-disable react/prop-types */

import ControllerContext from "./ControllerContext";
import ApplicationController from "./_applicationController";
import DomainController from "./_domainController";
import GitCredentialsController from "./_gitCredentialsController";
import IngressRulesController from "./_ingressRulesController";
import RedirectRulesController from "./_redirectRulesController";
import VolumeController from "./_volumeController";

const ControllerState = (props) => {
    const controllers =  {
        "redirect_rules": new RedirectRulesController(),
        "ingress_rules": new IngressRulesController(),
        "domains": new DomainController(),
        "git_credentials": new GitCredentialsController(),
        "volumes": new VolumeController(),
        "applications": new ApplicationController(),
    }

    // Return
    return (
        <ControllerContext.Provider value={controllers}>
            {props.children}
        </ControllerContext.Provider>
    )
}

export default ControllerState;