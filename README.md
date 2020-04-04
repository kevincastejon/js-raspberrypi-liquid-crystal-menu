# raspberrypi-liquid-crystal-menu
Easily makes menu for your lcd

## Overview
This module extends the [raspberrypi-liquid-crystal-simple](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-simple) LCD module and add a feature to make menu easily.
So all the original API is exposed through this module, check the usage [here](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-simple/blob/master/README.md#api)

## Install
```
npm i raspberrypi-liquid-crystal-menu
```

## Modes (how to use basic features along with the new one)
When instantiated, you can use the LCD object as usual. To start the 'menu' mode just call the openMenu() method and call the closeMenu() method to switch back to 'normal' mode.

When in 'menu' mode, you can't access default method such as setLine(), clear(), etc... Calling those will emit an error event. Only the navigation methods, specific to this module, will be accessibles.

On the contrary, when in 'normal' mode, only the base methods of the original API will be accessible and the navigation methods will emit an error event.

You can check what mode is currently set on the lcd by accessing the 'mode' property and comparing with the two convenience constants LCD.NORMAL and LCD.MENU or simply with the litteral strings "normal" and "menu".

## Usage
To open a menu send a 'menu' object to the openMenu() method.

### Menu
A menu object is a cascading object that can lead to another menus. [See examples](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu/tree/master/examples)

The object must contain the following properties:

- title : string - *required* - The displayed title.
- items: array of item objects - *required if no 'onInput' property* - The selectable items in this menu.
- onInput: function - *required if no 'items' property* - ! Makes this menu an input menu ! Function called when validating the user input, that function will receive the user input as only argument.
- onBack: function - *optional* - Function called when leaving back from this menu.
- back: menu object - *optional* - The menu to go back when using the goBack() navigation method. If not specified it will lead to the direct parent menu.

It MUST contains or an a 'items' or an 'onInput' property (one or the other) and a 'title' property.

If 'onInput' is specified the menu is then an 'input menu' and will not display any items, instead it will allow the user to enter text with the navigation methods:
- goUp/goDown : scrolls the letters
- goRight : validates a letter
- goLeft : erases the last letter
- goOn : validates the whole input
- goBack : leaves the menu back (as usual)

If 'items' is specified the menu is then an 'regular menu' and will display selectable items that the user can navigate through the navigation methods:
- goUp/goDown : selects previous/next item and calls the onSelect callback if provided.
- goRight/goOn : enters the item, calls the onEnter callback if provided. It leads to the next menu if the item contains a 'link' menu property, closes the menu otherwise.
- goLeft/goBack : leaves back the menu and calls the onBack callback if provided.

### Item
An item is an object that displays selectable labels on the LCD. [See examples](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu/tree/master/examples)

The object must contain the following properties:

- name : string - *required* - The displayed label.
- link: menu - *optional* - The menu that will be displayed when entering this item. If not provided, entering the item will simply call the callbacks (if any) and close the current menu.
- onSelect: function - *optional* - Function called when selecting the item (hover).
- onEnter: function - *optional* - Function called when entering the item.

## Basic Example
Basic usage
```
const myMenu = {
  title: 'My Menu',
  items: [
    {
      name: 'item 1',
      onSelect: () => console.log('selected item 1'),
      onEnter: () => console.log('entered item 1'),
      link: anotherMenu,
    },
    {
      name: 'item 2',
    },
  ]
};
lcd.openMenu(myMenu);
```

Input usage
```
const myInputMenu = {
  title: 'My input menu',
  onInput: (userInput) => console.log(userInput),
  ]
};
lcd.openMenu(myInputMenu);
```
## API (does not include the inherited [original API](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-simple/blob/master/README.md#api))
- **constructor ( bus : int, address : int, cols : int, rows : int [, customChars : [][]int] )**
### Constants
- **NORMAL** static [read-only] : string - Shortcut for "normal" value, use it along with the mode property.
- **MENU** static [read-only] : string - Shortcut for "right" value, use it along with the mode property.
### Properties
- **mode** [read-only] : string - Returns the current mode set on the LCD ("normal" or "menu").
### Methods
- **openMenu ( menu : 'menu' object )** : void - Opens the provided menu (makes the original API not accessible).
- **closeMenu ()** : void - Closes the current opened menu (makes the original API accessible).
- **goLeft ()** : void - Navigates left (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goRight ()** : void - Navigates right (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goUp ()** : void - Navigates up (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goDown ()** : void - Navigates down (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goBack ()** : void - Navigates back (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goOn ()** : void - Navigates forward (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))

### Events
- **error** (error) - Fires when an error is encountered.
