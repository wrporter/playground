import { useState } from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { createGrid } from './game-state';
import type { Battleship } from './game-state';

export interface BoardProps {
    game: Battleship;
    playerId: number;
    onUpdate: () => void;
}

const playerVariants = tv({
    slots: {
        guessBoard: 'flex flex-col border-4 border-amber-800',
        guessButton: 'w-5 h-5 bg-slate-400',
    },
    variants: {
        disabled: {
            true: {
                guessBoard: 'opacity-75',
            },
            false: {
                guessButton: 'hover:bg-blue-200',
            },
        },
    },
});

const positionVariants = tv({
    base: 'w-5 h-5',
    variants: {
        type: {
            water: 'bg-blue-400',
            ship: 'bg-gray-400',
            hit: 'bg-red-400',
            miss: 'bg-gray-100',
        },
    },
});

const guessVariants = tv({
    extend: positionVariants,
    variants: {
        type: {
            water: 'bg-amber-200',
        },
    },
});

type PositionVariants = VariantProps<typeof positionVariants>;

export function PlayerDisplay({ game, playerId, onUpdate }: BoardProps) {
    // TODO: Move memory to grids rather than finding locations to simplify logic.
    const [grid] = useState(createGrid());
    const [guesses] = useState(createGrid());
    const disabled = game.win || game.turn !== playerId;

    const { guessBoard, guessButton } = playerVariants({ disabled });

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex">
                Player: {playerId}
                {game.turn === playerId ? (
                    <div className="text-blue-600 ml-2">(Te toca!)</div>
                ) : null}
            </div>

            <fieldset className={guessBoard()} disabled={disabled}>
                {guesses.map((row, y) => {
                    return (
                        <div className="flex">
                            {row.map((_, x) => {
                                const guess = game.players[playerId].guesses.find(
                                    (guess) => guess.row === y && guess.col === x,
                                );
                                if (guess) {
                                    return (
                                        <div
                                            className={guessVariants({
                                                type: guess.hit ? 'hit' : 'miss',
                                            })}
                                        />
                                    );
                                }

                                return (
                                    <button
                                        className={guessButton()}
                                        type="button"
                                        onClick={() => {
                                            game.takeTurn({ row: y, col: x });
                                            onUpdate();
                                        }}
                                        aria-label="Select position to fire!"
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </fieldset>

            <div className="flex flex-col border-4 border-amber-800">
                {grid.map((row, y) => {
                    return (
                        <div className="flex">
                            {row.map((_, x) => {
                                const ship = game.players[playerId].ships.find((ship) =>
                                    ship.positions.find(
                                        (position) => position.row === y && position.col === x,
                                    ),
                                );
                                const shipPosition = ship?.positions.find(
                                    (position) => position.row === y && position.col === x,
                                );

                                let type: PositionVariants['type'] = 'water';
                                if (shipPosition) {
                                    if (shipPosition.hit) {
                                        type = 'hit';
                                    } else {
                                        type = 'ship';
                                    }
                                } else if (
                                    game.players[(playerId + 1) % 2].guesses.some(
                                        (guess) => guess.row === y && guess.col === x,
                                    )
                                ) {
                                    type = 'miss';
                                }

                                return <div className={positionVariants({ type })} />;
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
