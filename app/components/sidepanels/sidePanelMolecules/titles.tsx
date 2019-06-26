import React from "react";

import { Grommet, Heading } from "grommet";
import { grommet } from "grommet/themes";


export const SettingsHead = () => {
    return (
        <Grommet theme={grommet}>
            <Heading margin="none">Settings
            </Heading>
        </Grommet>
    )
}

export const SignOutLink = () => {
    return (
        <Grommet theme={grommet}>
            <Heading margin="none">SignOut
            </Heading>
        </Grommet>
    )
}

export const InformationPanel = () => {
    return (
        <Grommet theme={grommet}>
            <Heading size="190%" style={{ overflowWrap: "break-word", width: 'auto', padding: '5px 0px', margin: '0px 5px', borderBottom: '2px solid #7540D9' }}>Information
            </Heading>
        </Grommet>
    )
}