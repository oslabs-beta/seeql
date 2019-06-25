import React from "react";
import { Box, Button, Text } from "grommet";

import { FormDown, FormNext } from "grommet-icons";



const MenuButton = ({ label, open, submenu, ...rest }) => {
    const Icon = open ? FormDown : FormNext;
    return (
        <Button hoverIndicator="background" {...rest}>
            <Box
                margin={submenu ? { left: "small" } : undefined}
                direction="row"
                align="center"
                pad="xsmall"
            >
                <Icon color="brand" />
                <Text size="small">{label}</Text>
            </Box>
        </Button>
    );
};

export default MenuButton;