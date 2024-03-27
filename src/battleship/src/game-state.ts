export interface Player {
    ships: Ship[];
    guesses: (Point & { hit: boolean })[];
}
export interface Point {
    row: number;
    col: number;
}
export interface Ship {
    positions: (Point & { hit: boolean })[];
}

export class Battleship {
    /** Represents the player whose turn it is. */
    turn = 0;

    players: Player[] = [
        {
            ships: [
                {
                    positions: [
                        { row: 0, col: 1, hit: false },
                        { row: 0, col: 2, hit: false },
                        { row: 0, col: 3, hit: false },
                    ],
                },
            ],
            guesses: [],
        },
        {
            ships: [
                {
                    positions: [
                        { row: 1, col: 8, hit: false },
                        { row: 2, col: 8, hit: false },
                        { row: 3, col: 8, hit: false },
                    ],
                },
            ],
            guesses: [],
        },
    ];

    win = false;

    /**
     * Takes a user's turn with the guessed position.
     */
    takeTurn(position: Point) {
        const opponent = this.players[(this.turn + 1) % 2];

        let hit = false;
        for (let i = 0; i < opponent.ships.length; i += 1) {
            const ship = opponent.ships[i];
            for (let j = 0; j < ship.positions.length; j += 1) {
                if (
                    ship.positions[j].row === position.row &&
                    ship.positions[j].col === position.col
                ) {
                    ship.positions[j].hit = true;
                    hit = true;
                }
            }
        }

        // Keep track of guesses
        this.players[this.turn].guesses.push({ ...position, hit });

        // Switch turns
        this.turn = (this.turn + 1) % 2;

        // Determine winning state
        this.win = opponent.ships.every((ship) => ship.positions.every((position) => position.hit));
    }
}

export const GRID_SIZE = 10;

export function createGrid() {
    const grid = [];
    for (let row = 0; row < GRID_SIZE; row += 1) {
        grid.push(Array.apply(null, Array(GRID_SIZE)));
    }
    return grid;
}
