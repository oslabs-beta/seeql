const kateTheme:Partial<{}> = {
    panel: { baseColor: 'green', fontColor: 'red', headerColor: 'orange' },
    tabs: { baseColor: 'orange', baseColorActive: 'black', fontColor: 'red' },
    omniBox: {
      buttonColor: 'lightgreen',
      buttonColorActive: 'brown',
      fontColor: 'pink',
      fontColorActive: 'magenta'
    },
    main: { baseColor: 'green' },
    executeButton: {
      baseColor: 'lightgreen',
      border: '1px solid yellow',
      fontColor: 'green'
    },
    tables: {
      highlight: 'lightgreen',
      row: 'yellow',
      navButtonSelect: 'orange',
      navButtonBase: 'transparent',
      navButtonFontColor: 'blue',
      navButtonHover: 'green',
      resetButton: 'green',
      infoButton: 'orange',
      pinnedButton: 'red',
      pinnedButtonFontColor: 'blue',
      pinnedHover: 'pink'
    },
    link: { signOut: 'orange' }
  }

  export default kateTheme;