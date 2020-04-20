import React, { useState, useReducer, useContext, useEffect } from 'react';
import { Box, Button, Collapsible, Grommet, Text } from 'grommet';
import { grommet } from 'grommet/themes';
import MenuButton from './menuButton';
import Context from '../../../contexts/themeContext';
import themeReducer from '../../../reducers/themeReducer';
import { ipcRenderer } from 'electron';

const NestedCollapsible = () => {
  const [context, setContext] = useContext(Context);
  const [openMenu1, setOpenMenu1] = useState(false);
  const [openSubmenu1, setOpenSubmenu1] = useState(false);
  const [state, dispatch] = useReducer(themeReducer, context);

  function findCurMode(selectedMode, context) {
    /*
    - context is an array of objects where each element is a mode
    - each object has a property active and value
    - active is a boolean value
    - value is a string
    */
    const activeMode = context.reduce((acc, mode) => {
      if (mode.active) acc = mode.value;
      return acc;
    }, '');
    //a function that allows us to update the current mode by grabbing the value of the mode that is selected via e.target.value and uses the ipcRenderer API to send the value of the selected mode, the to be updated. We hold on to the value of the current mode by updating our theme context
    const setTheme = () => {
      ipcRenderer.send('user-theme-selected', selectedMode);
      dispatch({
        type: 'CHANGE_MODE',
        selected: selectedMode,
        payload: activeMode
      });
    };
    return setTheme;
  }
  useEffect(() => setContext(state), [state]);

  return (
    <Grommet theme={grommet}>
      <Box width="small">
        <MenuButton
          style={{ fontFamily: 'Poppins' }}
          open={openMenu1}
          label="Themes"
          onClick={() => {
            const newOpenMenu1 = !openMenu1;
            setOpenMenu1(newOpenMenu1);
            setOpenSubmenu1(!newOpenMenu1 ? false : openSubmenu1);
          }}
        />
        <Collapsible open={openMenu1}>
          <MenuButton
            submenu
            style={{ fontFamily: 'Poppins' }}
            open={openSubmenu1}
            label="Basic Themes"
            onClick={() => setOpenSubmenu1(!openSubmenu1)}
          />
          <Collapsible open={openSubmenu1}>
            <Button
              hoverIndicator="background"
              onClick={e => {
                const setTheme = findCurMode(e.target.dataset.value, context);
                setTheme();
              }}
            >
              <Box
                data-value="defaultTheme"
                margin={{ left: 'medium' }}
                direction="row"
                align="center"
                pad="xsmall"
              >
                <Text size="small" style={{ fontFamily: 'Poppins' }}>
                  Default
                </Text>
              </Box>
            </Button>
            <Button
              hoverIndicator="background"
              onClick={e => {
                const setTheme = findCurMode(e.target.dataset.value, context);
                setTheme();
              }}
            >
              <Box
                data-value="darkTheme"
                margin={{ left: 'medium' }}
                direction="row"
                align="center"
                pad="xsmall"
              >
                <Text size="small" style={{ fontFamily: 'Poppins' }}>
                  Dark
                </Text>
              </Box>
            </Button>
            {}
          </Collapsible>
        </Collapsible>
      </Box>
    </Grommet>
  );
};
export default NestedCollapsible;
