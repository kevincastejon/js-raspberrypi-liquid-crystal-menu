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
You have to register the menus with registerMethod() before opening them with the openMenu() method.

### Menu
A menu object is a cascading object with input field or items that can lead to another menus. [See examples](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu/tree/master/examples)

The object must contain the following properties:

- id : string - *required* - The unique id.
- title : string - *required* - The displayed title.
- items: array of item objects - *optional* - The selectable items in this menu. If not provided the menu will display an input field instead of selectable items.
- onInput: function - *optional* - Called, if provided, when the menu does not own an 'items' field and the user validate its input.
- autoClose : boolean - *optional* - If 'true' and the menu does not own an 'items' field the menu will self close after the user validate its input.
- link : string - *optional* - The menu id to open, when the menu does not own an 'items' field, after the user validate its input.
- onBack: function - *optional* - Function called when leaving back from this menu.
- back: int - *optional* - The number of parents menus to go back through when using the goBack() navigation method. If not specified it will lead to the direct parent menu.

A menu that does not own a 'items' field will be treated as an 'input' menu, displaying a input field instead of selectable items. The user will be able to enter the input through the navigation methods:
- goUp/goDown : scrolls the letters
- goRight : validates a letter
- goLeft : erases the last letter
- goOn : validates the whole input
- goBack : leaves the menu back (as usual)

If 'items' is specified the menu is then a 'regular menu' and will display selectable items that the user can navigate through the navigation methods:
- goUp/goDown : selects previous/next item and calls the onSelect callback if provided.
- goRight/goOn : enters the item, calls the onEnter callback if provided. It leads to the next menu if the item contains a 'link' menu property, closes the menu otherwise.
- goLeft/goBack : leaves back the menu and calls the onBack callback if provided.

### Item
An item is an object that displays selectable labels on the LCD. [See examples](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu/tree/master/examples)

The object must contain the following properties:

- name : string - *required* - The displayed label.
- link: string - *optional* - The menu id that will be displayed when entering this item.
- onSelect: function - *optional* - Function called when selecting the item (hover).
- onEnter: function - *optional* - Function called when entering the item.

### Dynamic data
Sometimes you need to display menu according to changing data, the upper static way of declaring a menu is not able to 'refresh' after registering.

Instead you would declare a menu as a method that will be called every time the menu is accessed. See below example.

### Custom characters
Custom characters works as they do in the extended [original API](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-simple/blob/master/README.md#api)), except that you can only specify 7 chars (instead of 8), that because one custom character is already reserved for this module (the double arrow items selection indicator)

## Basic Example
Items menu usage
```
const myMenu = {
  id: 'myMenu',
  title: 'My Menu',
  items: [
    {
      name: 'item 1',
      onSelect: () => console.log('selected item 1'),
      onEnter: () => console.log('entered item 1'),
      link: 'anotherMenu',
    },
    {
      name: 'item 2',
    },
  ]
};
lcd.registerMenus([myMenu]);
lcd.openMenu('myMenu');
```

Input menu usage (just don't provide 'items' field or set it to 'null')
```
const myInputMenu = {
  id: 'myInputMenu',
  title: 'My input menu',
  onInput: (userInput) => console.log(userInput),
  ]
};
lcd.registerMenus([myInputMenu]);
lcd.openMenu('myInputMenu');
```

Dynamic menu usage
```
const data = [{
  name: 'File 1',
},
{
  name: 'File 2',
},
{
  name: 'File 3',
}];

// This menu is not an object but a method that will be called every time this menu is accessed. Usefull to refresh some data.
const dynamicMenu = () => ({
  id: 'dynamicMenu',
  title: 'Data',
  items: data.map((file) => ({
    name: file.name,
    onSelect: () => console.log('select', file.name),
    onEnter: () => console.log('enter', file.name),
  })),
});
lcd.registerMenus([dynamicMenu]);
lcd.openMenu('dynamicMenu');
```

## API (does not include the inherited [original API](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-simple/blob/master/README.md#api))
- **constructor ( bus : int, address : int, cols : int, rows : int [, customChars : [][]int] )**
### Constants
- **NORMAL** static [read-only] : string - Shortcut for "normal" value, use it along with the mode property.
- **MENU** static [read-only] : string - Shortcut for "right" value, use it along with the mode property.
### Properties
- **mode** [read-only] : string - Returns the current mode set on the LCD ("normal" or "menu").
### Methods
- **registerMenus ( menus : array of menus )** : void - Registers the provided menus.
- **unregisterMenu ( menuId : string )** : void - Unregisters the menu with the provided id.
- **openMenu ( menuId : string )** : void - Opens the registered menu with the provided id (makes the original API not accessible).
- **closeMenu ()** : void - Closes the current opened menu (makes the original API accessible). Note that once menus are closed and the 'mode' property is set back to false, the LCD will retrieve any setting prior to openMenu() call (alignments, lines content, blink and cursor)
- **goLeft ()** : void - Navigates left (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goRight ()** : void - Navigates right (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goUp ()** : void - Navigates up (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goDown ()** : void - Navigates down (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goBack ()** : void - Navigates back (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **goOn ()** : void - Navigates forward (see [Modes section](https://github.com/kevincastejon/js-raspberrypi-liquid-crystal-menu#modes-how-to-use-basic-features-along-with-the-new-one))
- **render ()** : void - This method should not be called ! It provides an escape hatch in rare cases where the data are externally modified but the LCDMenu display has not been updated. Calling this will re-render the current menu, refetching any data used into it. Only usefull for dynamic menus.
### Events
- **error** (error) - Fires when an error is encountered.
