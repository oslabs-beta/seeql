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
            <Heading margin="none" size="190%" style={{ overflowWrap: "break-word" }}>Information
            </Heading>
        </Grommet>
    )
}