import React, { Component } from "react";
import { Box, Button, Collapsible, Grommet, Text } from "grommet";
import { grommet } from "grommet/themes";
import MenuButton from './menuButton'




class SingleCollapsible extends Component {
    state = {
        openMenu1: false,
    };

    render() {
        const { openMenu1 } = this.state;
        return (
            <Grommet theme={grommet}>
                <Box width="small">
                    <MenuButton
                        open={openMenu1}
                        label="Font Size"
                        onClick={() => {
                            const newOpenMenu1 = !openMenu1;
                            this.setState({
                                openMenu1: newOpenMenu1
                            });
                        }}
                    />

                        <Collapsible open ={openMenu1}>
                        <Button
                            hoverIndicator="background"
                            onClick={() => alert("xtrasmall clicked")}
                        >
                                <Box
                                    margin={{ left: "medium" }}
                                    direction="row"
                                    align="center"
                                    pad="xsmall"
                                >
                                    <Text size="small">Extra Small</Text>
                                </Box>
                            </Button>
                    

                        <Button
                            hoverIndicator="background"
                            onClick={() => alert("small clicked")}
                        >
                                <Box
                                    margin={{ left: "medium" }}
                                    direction="row"
                                    align="center"
                                    pad="xsmall"
                                >
                                    <Text size="small">Small</Text>
                                </Box>
</Button>


                        <Button
                            hoverIndicator="background"
                            onClick={() => alert("medium clicked")}
                        >
                        <Box
                            margin={{ left: "medium" }}
                            direction="row"
                            align="center"
                            pad="xsmall"
                        >
                            <Text size="small">Medium</Text>
                        </Box>

</Button>
                        <Button
                            hoverIndicator="background"
                            onClick={() => alert("large clicked")}
                        >
                        <Box
                            margin={{ left: "medium" }}
                            direction="row"
                            align="center"
                            pad="xsmall"
                        >
                            <Text size="small">Large</Text>
                        </Box>
</Button>

                        <Button
                            hoverIndicator="background"
                            onClick={() => alert("geriatric clicked")}
                        >
                        <Box
                            margin={{ left: "medium" }}
                            direction="row"
                            align="center"
                            pad="xsmall"
                        >
                            <Text size="small">Geriatric</Text>
                        </Box>
</Button>

                        
                         
                            {}
                        </Collapsible>
                      
                </Box>
            </Grommet>
        );
    }

}




export default SingleCollapsible