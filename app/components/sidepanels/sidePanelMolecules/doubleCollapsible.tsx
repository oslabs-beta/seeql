import React, { useState, useReducer, useContext, useEffect } from "react";
import { Box, Button, Collapsible, Grommet, Text } from "grommet";
import { grommet } from "grommet/themes";
import MenuButton from './menuButton'
//switch to a functional component! --
//import context--
import Context from '../../../contexts/themeContext'
//import usereducer--
import themeReducer from '../../../reducers/themeReducer'
import { ipcRenderer } from 'electron';
//payload will be selected current mode on context
//selected will be selected value

//reducer will need to grab the value, toggle the active mode and update the current mode value on the existing context

//last  use context setter to update global context

b


const NestedCollapsible =()=> {
    const [context, setContext] = useContext(Context)
    const [activeMode, setActiveMode ]= useState(context[2]['currentMode'])
    const[openMenu1, setOpenMenu1] = useState (false)
    const [openMenu2, setOpenMenu2] =useState (false)
    const [openSubmenu1, setOpenSubmenu1] =useState(false)

    const [state, dispatch] = useReducer(themeReducer, context)

    console.log ('activeMode', activeMode)
  
    
    const handleDispatch=( selectedMode, currentMode)=>{
        console.log('selectedmode, currentMode colapse', selectedMode, currentMode)
        ipcRenderer.send('user-theme-selected', selectedMode);
        dispatch({
            type: 'CHANGE_MODE',
            selected: selectedMode,
            payload: currentMode
        });
    }
useEffect(()=>{

    setContext(state)
    console.log ('newcontext', context)
},[state])
    
        return (
            <Grommet theme={grommet}>
                <Box width="small">
                    <MenuButton
                        open={openMenu1}
                        label="Themes"
                        onClick={() => {
                            const newOpenMenu1 = !openMenu1;
                            setOpenMenu1(newOpenMenu1)
                            setOpenSubmenu1(!newOpenMenu1 ? false : openSubmenu1)
                        }}
                    />
                    <Collapsible open={openMenu1}>
                        <MenuButton
                            submenu
                            open={openSubmenu1}
                            label="Basic Themes"
                            onClick={() => 
                                setOpenSubmenu1(!openSubmenu1)
                        }
                        />
                        <Collapsible open={openSubmenu1}>
                            <Button
                                hoverIndicator="background"
                                onClick={(e)=>handleDispatch(e.target.dataset.value, activeMode)}
                                >
                                <Box
                                    data-value="defaultTheme"
                                    margin={{ left: "medium" }}
                                    direction="row"
                                    align="center"
                                    pad="xsmall"
                                >
                                    <Text size="small">Default</Text>
                                </Box>
                            </Button>
                            <Button
                                hoverIndicator="background"
                                onClick={(e) => handleDispatch(e.target.dataset.value, activeMode)}
                                >
                                <Box
                                    data-value='darkTheme' 
                                    margin={{ left: "medium" }}
                                    direction="row"
                                    align="center"
                                    pad="xsmall"
                                >
                                    <Text size="small">Dark</Text>
                                </Box>
                            </Button>
                            {}
                        </Collapsible>
                    </Collapsible>
                   
                    
                </Box>
            </Grommet>
        );
    }








export default NestedCollapsible