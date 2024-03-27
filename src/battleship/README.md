# Battleship

## Design

- Data model
  - Board
    - 2D array of locations
    - Positions of ships
    - Memory of locations that have been guessed
  - Game
    - Player turn
    - Score - how many ships has each player sunk
    - Guess - inputs for coordinates and a button
    - Show feedback of a hit or miss
    - Game state - win/end
