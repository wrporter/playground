import { useState } from 'react';
import { tv } from 'tailwind-variants';

import { createGrid } from './game-state';
import type { Battleship } from './game-state';

export interface BoardProps {
    game: Battleship;
    player: number;
    onUpdate: () => void;
}

const playerVariants = tv({
    base: 'flex flex-col border border-amber-800 p-2',
    variants: {
        disabled: {
            true: 'opacity-75',
        },
    },
});

export function PlayerDisplay({ game, player, onUpdate }: BoardProps) {
    // TODO: Move memory to grids rather than finding locations.
    const [grid] = useState(createGrid());
    const [guesses] = useState(createGrid());
    const disabled = game.win || game.turn !== player;

    return (
        <div className="flex flex-col space-y-2">
            <div>Player: {player}</div>

            <fieldset className={playerVariants({ disabled })} disabled={disabled}>
                {guesses.map((row, y) => {
                    return (
                        <div className="flex">
                            {row.map((_, x) => {
                                const guess = game.players[player].guesses.find(
                                    (guess) => guess.row === y && guess.col === x,
                                );
                                if (guess) {
                                    return (
                                        <div className="flex w-5 h-5 justify-center">
                                            {guess.hit ? 'X' : '.'}
                                        </div>
                                    );
                                }
                                return (
                                    <button
                                        className="flex w-5 h-5 justify-center"
                                        type="button"
                                        onClick={() => {
                                            game.takeTurn({ row: y, col: x });
                                            onUpdate();
                                        }}
                                    >
                                        ?
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </fieldset>

            <div className="flex flex-col border border-amber-800 p-2">
                {grid.map((row, y) => {
                    return (
                        <div className="flex">
                            {row.map((_, x) => {
                                const ship = game.players[player].ships.find((ship) =>
                                    ship.positions.find(
                                        (position) => position.row === y && position.col === x,
                                    ),
                                );
                                const shipPosition = ship?.positions.find(
                                    (position) => position.row === y && position.col === x,
                                );

                                let display = 'W';
                                if (shipPosition) {
                                    if (shipPosition.hit) {
                                        display = 'X';
                                    } else {
                                        display = 'S';
                                    }
                                }

                                return <div className="flex w-5 h-5 justify-center">{display}</div>;
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
