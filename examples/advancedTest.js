const LCDMenu = require('../index');
const consoleKeyboardControl = require('./consoleKeyboardControl');

const files = [{
  name: 'File 1',
},
{
  name: 'File 2',
},
{
  name: 'File 3',
}];
const lcd = new LCDMenu(1, 0x3f, 16, 2);
lcd.on('error', (err) => console.log(err));
lcd.on('ready', () => {
  console.log('LCD is ready');
  consoleKeyboardControl(lcd);
  console.log('Use arrows, backspace and return (enter) to navigate through the lcd menu');
});
const inputMenu = {
  id: 'input',
  title: 'Input',
  onInput: (input) => {
    files.push({ name: input });
  },
  link: 'files',
};
// This menu is not an object but a method that will be called every time this menu is accessed. Usefull to refresh some data
const filesMenu = () => ({
  id: 'files',
  title: 'Files',
  onBack: () => console.log('back from filesMenu'),
  items: files.map((file) => ({
    name: file.name,
    onSelect: () => console.log('select', file.name),
    onEnter: () => console.log('enter', file.name),
  })),
});
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
      onSelect: () => console.log('select SubOption'),
      onEnter: () => console.log('enter SubOption'),
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
      onSelect: () => console.log('select Input'),
      onEnter: () => console.log('enter Input'),
      link: 'input',
    },
    {
      name: 'Close',
      onSelect: () => console.log('select Close'),
      onEnter: () => console.log('enter Close'),
      autoClose: true,
    },
  ],
};
lcd.registerMenus([mainMenu, filesMenu, optionsMenu, subOptionsMenu, inputMenu]);
lcd.openMenu('main');
