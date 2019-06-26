import React from "react";

import { Grommet, Heading } from "grommet";
import { grommet } from "grommet/themes";


export const SettingsHead = () => {
    return (
        <Grommet theme={grommet} >
            <Heading size="190%" style={{ fontFamily: 'Poppins', textAlign: 'center', overflowWrap: "break-word", width: 'auto', padding: '5px 0px', margin: '0px 5px', borderBottom: '2px solid #4B70FE' }}>Settings
            </Heading>
        </Grommet>
    )
}

export const SignOutLink = () => {
    return (
        <Grommet theme={grommet}>
            <Heading size="100%" style={{ fontFamily: 'Poppins', textDecoration: 'none', overflowWrap: "break-word", width: 'auto', padding: '5px 0px', margin: '0px 5px' }}>SignOut
            </Heading>
        </Grommet>
    )
}

export const InformationPanel = () => {
    return (
        <Grommet theme={grommet}>
            <Heading size="190%" style={{ fontFamily: 'Poppins', overflowWrap: "break-word", width: 'auto', padding: '5px 0px', margin: '0px 5px', borderBottom: '2px solid #4B70FE' }}>Information
            </Heading>
        </Grommet>
    )
}