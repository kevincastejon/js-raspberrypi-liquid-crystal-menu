const LCDMenu = require('../index');

const lcd = new LCDMenu(1, 0x3f, 16, 2);

// Add arrows control from console to test the menu
const { stdin } = process;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', (key) => {
  if (key === '\u0003') {
    process.exit();
  } else if (key === '\u001B\u005B\u0041' && lcd.mode === LCDMenu.MENU) {
    lcd.goUp();
  } else if (key === '\u001B\u005B\u0042' && lcd.mode === LCDMenu.MENU) {
    lcd.goDown();
  } else if (key === '\u001B\u005B\u0044' && lcd.mode === LCDMenu.MENU) {
    lcd.goLeft();
  } else if (key === '\u001B\u005B\u0043' && lcd.mode === LCDMenu.MENU) {
    lcd.goRight();
  } else if (key === '\u000D' && lcd.mode === LCDMenu.MENU) {
    lcd.goOn();
  } else if (key === '\u007f' && lcd.mode === LCDMenu.MENU) {
    lcd.goBack();
  }
});
const inputMenu = {
  title: 'Input',
  onInput: (input) => {
    lcd.setLine(0, 'HELLO WORLD');
  },
};
const filesMenu = {
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
  title: 'SubOption',
  onBack: () => console.log('back from optionsMenu'),
  back: null,
  items: [
    {
      name: 'SubOption 1',
      onSelect: () => console.log('select SubOption 1'),
      onEnter: () => console.log('enter SubOption 1'),
    },
  ],
};
const optionsMenu = {
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
      link: subOptionsMenu,
    },
  ],
};
const mainMenu = {
  title: 'Menu',
  items: [
    {
      name: 'Files',
      onSelect: () => console.log('select Files'),
      onEnter: () => console.log('enter Files'),
      link: filesMenu,
    },
    {
      name: 'Options',
      onSelect: () => console.log('select Options'),
      onEnter: () => console.log('enter Options'),
      link: optionsMenu,
    },
    {
      name: 'Input',
      onSelect: () => console.log('select Options'),
      onEnter: () => console.log('enter Options'),
      link: inputMenu,
    },
  ],
};
subOptionsMenu.back = mainMenu;
lcd.openMenu(mainMenu);
