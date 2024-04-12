# Planets and Films

Adapted from the an interview at https://jsfiddle.net/x2ctuz6h/.

## Requirements

1. Identify problems with the code and how it could be optimized.
2. Fix issues and make optimizations.

## Solution

### [Demo!](https://wrporter.github.io/playground/planets-and-films/)

### Problems

1. API requests are sent prior to a timeout starting to render the content. The code presents a race condition where if the timeout finishes prior to the request completing, nothing will get rendered. We should render the data on a callback from the request rather than an artificial timeout.
2. The timeouts slow down processing where we could immediately render data when we have it, rather than after an arbitrary amount of time.
3. The planets are not paginated.
4. The films are treated as if they are film titles, when they are API URLs and a separate request should be made for each. We can cache the film data for duplicate films across planets.
5. The initial code loops through films and planets to find matches, when it can simply use the first one from each planet.
6. Finally, we can use up-to-date technologies, such as Fetch rather than XMLHttpRequest and React over vanilla JavaScript.

## Usage

1. Run `npm install`.
2. Run `npm run dev`.
3. Visit http://localhost:5173/.
