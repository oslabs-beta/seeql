const white = 'white';
const grey = '#E8ECF1';
const black = 'black';
const green = '#4DAF7C';

const happi = {
  panel: { baseColor: white, fontColor: black, headerColor: black },
  tabs: { baseColor: 'transparent', baseColorActive: 'transparent', fontColor: black },
  omniBox: {
    buttonColor: white,
    buttonColorActive: grey,
    fontColor: black,
    fontColorActive: black
  },
  main: {
    baseColor: 'transparent'
  },
  executeButton: {
    baseColor: green,
    border: green,
    fontColor: white
  },
  tables: {
    highlight: 'orange',
    row: 'lightblue',
    navButtonSelect: '#E55982',
    navButtonBase: 'transparent',
    navButtonFontColor: black,
    navButtonHover: '#E55982',
    resetButton: '#E55982',
    infoButton: 'orange',
    pinnedButton: 'red',
    pinnedButtonFontColor: 'blue',
    pinnedHover: 'pink'
  },
  link: { signOut: '#E55982' }
}

export default happi;