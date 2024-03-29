export interface Player {
    ships: Ship[];
    guesses: Record<number, Square>;
    score: number;
}

export interface Point {
    row: number;
    col: number;
}

export interface Ship {
    positions: Record<number, Square>;
    sunk: boolean;
}

export interface Square extends Point {
    hit: boolean;
}

export function getId(row: number, col: number, size: number) {
    return row * size + col;
}

export function getCoordinate(id: number, size: number) {
    return { row: id / size, col: id % size };
}

export class Battleship {
    constructor(public size: number = 10) {
        // TODO: Do not allow ships to overlap.
        // TODO: Allow players to place their own ships prior to staring the game.
        // TODO: Add websockets and a backend to play across devices or add an overlay between
        //  turns to hide the boards.
        this.players = [
            {
                ships: [
                    this.buildShip(0, 1, 3, 'horizontal'),
                    this.buildShip(8, 8, 2, 'horizontal'),
                    this.buildShip(2, 5, 5, 'vertical'),
                ],
                guesses: {},
                score: 0,
            },
            {
                ships: [
                    this.buildShip(1, 8, 3, 'vertical'),
                    this.buildShip(5, 1, 2, 'horizontal'),
                    this.buildShip(9, 0, 5, 'horizontal'),
                ],
                guesses: {},
                score: 0,
            },
        ];
    }

    /** Represents the player whose turn it is. */
    turn = 0;

    players: Player[];

    win = false;

    /**
     * Takes a user's turn with the guessed position.
     */
    takeTurn(position: Point) {
        if (this.win) {
            return;
        }

        const activePlayer = this.getActivePlayer();
        const opponent = this.getOpponent();
        const positionId = getId(position.row, position.col, this.size);

        const ship = opponent.ships.find((ship) => ship.positions[positionId]);
        const hit = Boolean(ship);
        if (ship) {
            ship.positions[positionId].hit = true;
            if (Object.values(ship.positions).every(({ hit }) => hit)) {
                activePlayer.score += 1;
                ship.sunk = true;
            }
        }

        // Keep track of guesses
        activePlayer.guesses[positionId] = { ...position, hit };

        // Determine winning state
        this.win = opponent.ships.every((ship) => ship.sunk);

        // Switch turns
        this.turn = this.getOpponentId();
    }

    getActivePlayer() {
        return this.players[this.turn];
    }

    getOpponentId() {
        return (this.turn + 1) % 2;
    }

    getOpponent() {
        return this.players[this.getOpponentId()];
    }

    buildShip(
        row: number,
        col: number,
        size: number,
        orientation: 'horizontal' | 'vertical',
    ): Ship {
        const ship: Ship = { positions: {}, sunk: false };

        if (orientation === 'horizontal' && col >= 0 && col + size <= this.size) {
            for (let c = col; c < col + size; c += 1) {
                ship.positions[getId(row, c, this.size)] = { row, col: c, hit: false };
            }
        } else if (orientation === 'vertical' && row >= 0 && row + size <= this.size) {
            for (let r = row; r < row + size; r += 1) {
                ship.positions[getId(r, col, this.size)] = { row: r, col, hit: false };
            }
        }

        return ship;
    }
}
