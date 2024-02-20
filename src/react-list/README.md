# React List

Adapted from the Close interview at https://jsfiddle.net/mladylukas/9qmusLok/.

## Requirements

Implement a feature to allow item selection with the following requirements:

1. Clicking an item selects/unselects it.
2. Multiple items can be selected at a time.
3. Make sure to avoid unnecessary re-renders of each list item in the big list (performance).
4. Currently selected items should be visually highlighted.
5. Currently selected items' names should be shown at the top of the page.

Feel free to change the component structure at will.

## Solution

### [Demo!](https://wrporter.github.io/playground/react-list/)

I've included multiple solutions, each building on the last. Note that I did not use the original CSS that was provided because I preferred to use Tailwind and opted for a more accessible design for color blindness with hover, press, and focus states.

- [0-simple](src/progression/0-simple.tsx): does the bare minimum to meet the requirements.
- [1-memoized](src/progression/1-memoized.tsx): splits out the options and memoizes them to prevent re-renders.
- [2-accessible](src/progression/2-accessible.tsx): adds accessibility for keyboard and screen reader users.
- [3-generic](src/progression/3-generic/3-generic.tsx): provides a generic, unstyled listbox component.

## Demo

![Demo](demo.gif)

## Usage

1. Run `npm install`.
2. Run `npm run dev`.
3. Visit http://localhost:5173/.
