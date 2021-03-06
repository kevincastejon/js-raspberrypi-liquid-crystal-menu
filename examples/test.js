const LCDMenu = require('../index');
const consoleKeyboardControl = require('./consoleKeyboardControl');

const lcd = new LCDMenu(1, 0x3f, 16, 2);

// Add arrows control from console for testing purpose
consoleKeyboardControl(lcd);
console.log('Use arrows, backspace and return (enter) to navigate through the lcd menu');

const inputMenu = {
  id: 'input',
  title: 'Enter your name',
  onInput: (input) => {
    lcd.setLine(0, `HELLO ${input}`);
  },
};
const filesMenu = {
  id: 'files',
  title: 'Files',
  onBack: () => console.log('back from filesMenu'),
  items: [
    {
      name: 'Fichier 1',
      onSelect: () => console.log('select Fichier 1'),
      onEnter: () => console.log('enter Fichier 1'),
    },
    {
      name: 'Fichier 2',
      onSelect: () => console.log('select Fichier 2'),
      onEnter: () => console.log('enter Fichier 2'),
    },
  ],
};
const subOptionsMenu = {
  id: 'subOptions',
  title: 'SubOptions',
  onBack: () => console.log('back from optionsMenu'),
  back: 2,
  items: [
    {
      name: 'SubOption 1',
      onSelect: () => console.log('select SubOption 1'),
      onEnter: () => console.log('enter SubOption 1'),
    },
  ],
};
const optionsMenu = {
  id: 'options',
  title: 'Options',
  onBack: () => console.log('back from optionsMenu'),
  items: [
    {
      name: 'Option 1',
      onSelect: () => console.log('select Option 1'),
      onEnter: () => console.log('enter Option 1'),
    },
    {
      name: 'Option 2',
      onSelect: () => console.log('select Option 2'),
      onEnter: () => console.log('enter Option 2'),
    },
    {
      name: 'SubOptions',
      onSelect: () => console.log('select Option 2'),
      onEnter: () => console.log('enter Option 2'),
      link: 'subOptions',
    },
  ],
};
const mainMenu = {
  id: 'main',
  title: 'Menu',
  items: [
    {
      name: 'Files',
      onSelect: () => console.log('select Files'),
      onEnter: () => console.log('enter Files'),
      link: 'files',
    },
    {
      name: 'Options',
      onSelect: () => console.log('select Options'),
      onEnter: () => console.log('enter Options'),
      link: 'options',
    },
    {
      name: 'Input',
      onSelect: () => console.log('select Options'),
      onEnter: () => console.log('enter Options'),
      link: 'input',
    },
  ],
};
lcd.registerMenus([mainMenu, filesMenu, optionsMenu, subOptionsMenu, inputMenu]);
lcd.openMenu('main');
