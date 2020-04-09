const LCDMenu = require('../index');

module.exports = (lcd) => {
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
};
