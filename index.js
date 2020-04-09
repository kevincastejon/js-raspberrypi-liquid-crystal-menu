const LCD = require('raspberrypi-liquid-crystal-simple');
const chars = require('./chars.js');

class LCDMenu extends LCD {
  constructor(bus, address, width, height, customChars = []) {
    super(bus, address, width, height, [[0x4, 0xe, 0x1f, 0x0, 0x0, 0x1f, 0xe, 0x4]].concat(customChars));
    console.log(this.getAlignment(0));
    console.log(super.getAlignment(0));
    this.init();
    this._currentMenu = null;
    this._currentItem = -1;
    this._currentInput = '';
    this._currentInputChar = 0;
    this._mode = 'normal';
    this._menus = [];
    this._navBuffer = [];
    this._blinkBackup = false;
    this._cursorBackup = false;
    this._linesBackup = [];
    this._alignsBackup = [];
  }

  _clear() {
    super.clear();
  }

  clear() {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the _closeMenu() method.');
      return;
    }
    this._clear();
  }

  _getAlignment(lineIndex) {
    return super.getAlignment(lineIndex);
  }

  getAlignment(lineIndex) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the _closeMenu() method.');
      return null;
    }
    return this._getAlignment(lineIndex);
  }

  _setAlignment(lineIndex, alignment) {
    super.setAlignment(lineIndex, alignment);
  }

  setAlignment(lineIndex, alignment) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the _closeMenu() method.');
      return;
    }
    this._setAlignment(lineIndex, alignment);
  }

  _getLine(lineIndex) {
    return super.getLine(lineIndex);
  }

  getLine(lineIndex) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the _closeMenu() method.');
      return null;
    }
    return this._getLine(lineIndex);
  }

  _setLine(lineIndex, text) {
    super.setLine(lineIndex, text);
  }

  setLine(lineIndex, text) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the _closeMenu() method.');
      return;
    }
    this._setLine(lineIndex, text);
  }

  _getChar(charIndex) {
    return super.getChar(charIndex);
  }

  getChar(charIndex) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the _closeMenu() method.');
      return null;
    }
    return this._getChar(charIndex);
  }

  set blink(value) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the _closeMenu() method.');
      return;
    }
    this._setBlink(value);
  }

  _setBlink(value) {
    super.blink = value;
  }

  set cursor(value) {
    if (this._mode === 'menu') {
      this.emit('error', 'You can only use the navigation methods when in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Close the menu first with the _closeMenu() method.');
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
    const menu = this._getMenu(this._currentMenu);
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (menu.items) {
      this._currentItem = this._currentItem - 1 < 0 ? menu.items.length - 1 : this._currentItem - 1;
      if (menu.items[this._currentItem].onSelect) {
        menu.items[this._currentItem].onSelect();
      }
    } else {
      this._currentInputChar = this._currentInputChar + 1 > chars.length - 1 ? 0 : this._currentInputChar + 1;
    }
    this.render();
  }

  goDown() {
    const menu = this._getMenu(this._currentMenu);
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (menu.items) {
      this._currentItem = this._currentItem + 1 > menu.items.length - 1 ? 0 : this._currentItem + 1;
      if (menu.items[this._currentItem].onSelect) {
        menu.items[this._currentItem].onSelect();
      }
    } else {
      this._currentInputChar = this._currentInputChar - 1 < 0 ? chars.length - 1 : this._currentInputChar - 1;
    }
    this.render();
  }

  goLeft() {
    const menu = this._getMenu(this._currentMenu);
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (menu.items) {
      this.goBack();
    } else if (this._currentInput.length > 0) {
      this._currentInputChar = chars.indexOf(this._currentInput[this._currentInput.length - 1]);
      this._currentInput = this._currentInput.substr(0, this._currentInput.length - 1);
      this.render();
    }
  }

  goRight() {
    const menu = this._getMenu(this._currentMenu);
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (menu.items) {
      this.goOn();
    } else {
      this._currentInput += chars[this._currentInputChar];
      this._currentInputChar = 0;
      this.render();
    }
  }

  goOn() {
    const menu = this._getMenu(this._currentMenu);
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (menu.items) {
      if (menu.items[this._currentItem].onEnter) {
        menu.items[this._currentItem].onEnter();
      }
      if (menu.items[this._currentItem].link) {
        this._navBuffer.push({ id: this._currentMenu, item: this._currentItem });
        this._openMenu(menu.items[this._currentItem].link);
      } else if (menu.items[this._currentItem].autoClose) {
        this.closeMenu();
      }
    } else {
      if (menu.onInput) {
        menu.onInput(this._currentInput);
      }
      if (menu.link) {
        this._openMenu(menu.link);
      } else if (menu.autoClose) {
        this.closeMenu();
      }
    }
  }

  goBack() {
    const menu = this._getMenu(this._currentMenu);
    if (this._mode !== 'menu') {
      this.emit('error', 'You cannot use the navigation methods when not in "menu" mode. Check with the "mode" property and the constants NORMAL and MENU. Open a menu first with the openMenu() method.');
      return;
    }
    if (menu.onBack) {
      menu.onBack();
    }
    if (this._navBuffer.length > 0) {
      const deep = menu.back ? menu.back : 1;
      const len = this._navBuffer.length;
      const realDeep = deep > len ? len : deep;
      const removeElt = this._navBuffer.splice(len - realDeep, realDeep)[0];
      const lastNav = removeElt;
      this._openMenu(lastNav.id, lastNav.item);
    }
  }

  openMenu(menu) {
    this._blinkBackup = this.blink;
    this._cursorBackup = this.cursor;
    for (let i = 0; i < this.lines.length; i += 1) {
      this._linesBackup[i] = this.lines[i];
      this._alignsBackup[i] = this.getAlignment(i);
      if (i === 0) {
        this._setAlignment(i, LCD.CENTER);
      } else {
        this._setAlignment(i, LCD.LEFT);
      }
    }
    this._openMenu(menu);
  }

  closeMenu() {
    this._closeMenu();
    this.blink = this._blinkBackup;
    this.cursor = this._cursorBackup;
    this.lines = this._linesBackup;
    console.log(this._alignsBackup);
    for (let i = 0; i < this._alignsBackup.length; i += 1) {
      this.setAlignment(i, this._alignsBackup[i]);
    }
  }

  _closeMenu() {
    this._currentMenu = null;
    this._currentItem = -1;
    this._currentInput = '';
    this._currentInputChar = 0;
    this._mode = 'normal';
    this.blink = false;
    this._clear();
  }

  unregisterMenu(id) {
    const menu = this._getMenu(id);
    if (menu) {
      this._menus.splice(this._menus.indexOf(menu), 1);
    }
  }

  registerMenus(menus) {
    for (let i = 0; i < menus.length; i += 1) {
      const id = typeof menus[i] === 'function' ? menus[i]().id : menus[i].id;
      if (this._getMenu(id)) {
        this.emit('error', `${id} : Multiple menus with same ID! "id" field must be unique.`);
        return;
      }
      if (typeof menus[i] === 'function') {
        this._menus.push(menus[i]);
      } else {
        this._menus.push({ ...menus[i] });
      }
    }
  }

  _getMenu(id) {
    for (let i = 0; i < this._menus.length; i += 1) {
      const m = typeof this._menus[i] === 'function' ? this._menus[i]() : this._menus[i];
      if (m.id === id) {
        return m;
      }
    }
    return null;
  }

  // static _treatMenu(_menu) {
  //   if (!_menu.items && !_menu.onInput) {
  //     throw new Error('A menu object must contain an "items" array property OR a "onInput" callback property');
  //   }
  //   if (!_menu.title) {
  //     throw new Error('A menu object must contain a "title" string property');
  //   }
  //   if (_menu.items) {
  //     const menu = _menu;
  //     for (let i = 0; i < menu.items.length; i += 1) {
  //       if (!menu.items[i].name) {
  //         throw new Error('An item object must contain a "name" string property');
  //       }
  //       if (menu.items[i].link && !menu.items[i].link.back) {
  //         menu.items[i].link.back = menu;
  //         menu.items[i].link.backItemIndex = i;
  //         LCDMenu._treatMenu(menu.items[i].link);
  //       }
  //     }
  //   }
  // }

  _openMenu(id, itemIndex = 0) {
    this._closeMenu();
    this._mode = 'menu';
    this._currentMenu = id;
    this._currentItem = itemIndex;
    this.render();
  }

  render() {
    const menu = this._getMenu(this._currentMenu);
    if (!menu) {
      this.emit('error', new Error(`invalid menu reference : ${this._currentMenu} ! Be sure to use only string reference to the menu's id.`));
      return;
    }
    this._setLine(0, menu.title ? menu.title : '');
    if (menu.onInput) {
      this._setBlink(true);
      this._setLine(1, this._currentInput + chars[this._currentInputChar]);
    } else {
      this._setLine(1, menu.items[this._currentItem].name + Array(this.cols - menu.items[this._currentItem].name.length - 1).fill(' ').join('') + LCD.getChar(0));
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
