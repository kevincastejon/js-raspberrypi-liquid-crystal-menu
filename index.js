const LCD = require('raspberrypi-liquid-crystal-simple');
const chars = require('./chars.js');

class LCDMenu extends LCD {
  constructor(bus, address, width, height, customChars = []) {
    super(bus, address, width, height, [[0x4, 0xe, 0x1f, 0x0, 0x0, 0x1f, 0xe, 0x4]].concat(customChars));
    this.init();
    this._currentMenu = null;
    this._currentItem = -1;
    this._currentInput = '';
    this._currentInputChar = 0;
    this._mode = 'normal';
  }

  _clear() {
    super.clear();
  }

  clear() {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the closeMenu() method.');
      return;
    }
    this._clear();
  }

  _getAlignment() {
    super.getAlignment();
  }

  getAlignment() {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the closeMenu() method.');
      return;
    }
    this._getAlignment();
  }

  _setAlignment() {
    super.setAlignment();
  }

  setAlignment() {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the closeMenu() method.');
      return;
    }
    this._setAlignment();
  }

  _getLine(lineIndex) {
    super.getLine(lineIndex);
  }

  getLine(lineIndex) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the closeMenu() method.');
      return;
    }
    this._getLine(lineIndex);
  }

  _setLine(lineIndex, text) {
    super.setLine(lineIndex, text);
  }

  setLine(lineIndex, text) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the closeMenu() method.');
      return;
    }
    this._setLine(lineIndex, text);
  }

  _getChar(charIndex) {
    super.getChar(charIndex);
  }

  getChar(charIndex) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the closeMenu() method.');
      return;
    }
    this._getChar(charIndex);
  }

  set blink(value) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the closeMenu() method.');
      return;
    }
    this._setBlink(value);
  }

  set _blink(value) {
    super.blink = value;
  }

  set cursor(value) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the closeMenu() method.');
      return;
    }
    this._setCursor = value;
  }

  _setCursor(value) {
    super.cursor = value;
  }

  static get NORMAL() {
    return 'normal';
  }

  static get MENU() {
    return 'menu';
  }

  get mode() {
    return this._mode;
  }

  goUp() {
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (this._currentMenu.items) {
      this._currentItem = this._currentItem - 1 < 0 ? this._currentMenu.items.length - 1 : this._currentItem - 1;
      if (this._currentMenu.items[this._currentItem].onSelect) {
        this._currentMenu.items[this._currentItem].onSelect();
      }
    } else {
      this._currentInputChar = this._currentInputChar + 1 > chars.length - 1 ? 0 : this._currentInputChar + 1;
    }
    this._updateDisplay();
  }

  goDown() {
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (this._currentMenu.items) {
      this._currentItem = this._currentItem + 1 > this._currentMenu.items.length - 1 ? 0 : this._currentItem + 1;
      if (this._currentMenu.items[this._currentItem].onSelect) {
        this._currentMenu.items[this._currentItem].onSelect();
      }
    } else {
      this._currentInputChar = this._currentInputChar - 1 < 0 ? chars.length - 1 : this._currentInputChar - 1;
    }
    this._updateDisplay();
  }

  goLeft() {
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (this._currentMenu.items) {
      this.goBack();
    } else if (this._currentInput.length > 0) {
      this._currentInputChar = chars.indexOf(this._currentInput[this._currentInput.length - 1]);
      this._currentInput = this._currentInput.substr(0, this._currentInput.length - 1);
      this._updateDisplay();
    }
  }

  goRight() {
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (this._currentMenu.items) {
      this.goOn();
    } else {
      this._currentInput += chars[this._currentInputChar];
      this._currentInputChar = 0;
      this._updateDisplay();
    }
  }

  goOn() {
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (this._currentMenu.items) {
      if (this._currentMenu.items[this._currentItem].onEnter) {
        this._currentMenu.items[this._currentItem].onEnter();
      }
      if (this._currentMenu.items[this._currentItem].link) {
        this._openSubMenu(this._currentMenu.items[this._currentItem].link);
      } else {
        this.closeMenu();
      }
    } else {
      const tempMenu = this._currentMenu;
      this.closeMenu();
      tempMenu.onInput(this._currentInput);
    }
  }

  goBack() {
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (this._currentMenu.onBack) {
      this._currentMenu.onBack();
    }
    if (this._currentMenu.back) {
      this._openSubMenu(this._currentMenu.back, this._currentMenu.backItemIndex);
    }
  }

  openMenu(menu) {
    LCDMenu._treatMenu(menu);
    this._openSubMenu(menu);
  }

  closeMenu() {
    this._currentMenu = null;
    this._currentItem = -1;
    this._currentInput = '';
    this._currentInputChar = 0;
    this._mode = 'normal';
    this._setAlignment(0, LCD.CENTER);
    this._setAlignment(1, LCD.LEFT);
    this.blink = false;
    this._clear();
  }

  static _treatMenu(_menu) {
    if (!_menu.items && !_menu.onInput) {
      throw new Error('A menu object must contain an "items" array property OR a "onInput" callback property');
    }
    if (!_menu.title) {
      throw new Error('A menu object must contain a "title" string property');
    }
    if (_menu.items) {
      const menu = _menu;
      for (let i = 0; i < menu.items.length; i += 1) {
        if (!menu.items[i].name) {
          throw new Error('An item object must contain a "name" string property');
        }
        if (menu.items[i].link && !menu.items[i].link.back) {
          menu.items[i].link.back = menu;
          menu.items[i].link.backItemIndex = i;
          LCDMenu._treatMenu(menu.items[i].link);
        }
      }
    }
  }

  _openSubMenu(menu, itemIndex = -1) {
    this.closeMenu();
    this._mode = 'menu';
    this._currentMenu = menu;
    if (itemIndex > -1) {
      this._currentItem = itemIndex - 1;
    }
    if (this._currentMenu.items) {
      this.goDown();
    } else {
      this._updateDisplay();
    }
  }

  _updateDisplay() {
    this._setAlignment(0, LCD.CENTER);
    this._setAlignment(1, LCD.LEFT);
    this._setLine(0, this._currentMenu.title ? this._currentMenu.title : '');
    if (this._currentMenu.onInput) {
      this._setBlink(true);
      this._setLine(1, this._currentInput + chars[this._currentInputChar]);
    } else {
      this._setLine(1, this._currentMenu.items[this._currentItem].name + Array(this.cols - this._currentMenu.items[this._currentItem].name.length - 1).fill(' ').join('') + LCD.getChar(0));
    }
  }

  static createItem(name, link = null, onSelect = null, onEnter = null) {
    return ({
      name, link, onSelect, onEnter,
    });
  }

  static createMenu(title, itemsOrInputCallback, onBack = null, back = null) {
    const menu = { title, back, onBack };
    if (Array.isArray(itemsOrInputCallback)) {
      menu.items = itemsOrInputCallback.concat();
    } else {
      menu.onInput = itemsOrInputCallback;
    }
    return (menu);
  }
}
module.exports = LCDMenu;
