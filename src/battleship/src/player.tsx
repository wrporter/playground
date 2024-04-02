import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import type { Battleship } from './game-state';
import { getId } from './game-state';

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
            sunk: 'bg-red-700',
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
    const disabled = game.win || game.turn !== playerId;

    const { guessBoard, guessButton } = playerVariants({ disabled });

    const guessRows = [];
    for (let row = 0; row < game.size; row += 1) {
        const cols = [];

        for (let col = 0; col < game.size; col += 1) {
            const positionId = getId(row, col, game.size);
            const guess = game.players[playerId].guesses[positionId];

            if (guess) {
                const opponent = game.players[(playerId + 1) % 2];
                const sunkShip = opponent.ships.find(
                    (ship) => ship.positions[positionId] && ship.sunk,
                );

                let type: PositionVariants['type'] = 'miss';
                if (sunkShip) {
                    type = 'sunk';
                } else if (guess.hit) {
                    type = 'hit';
                }

                cols.push(
                    <div
                        key={col}
                        className={guessVariants({
                            type,
                        })}
                    />,
                );
            } else {
                cols.push(
                    <button
                        key={col}
                        className={guessButton()}
                        type="button"
                        onClick={() => {
                            game.takeTurn({ row, col });
                            onUpdate();
                        }}
                        aria-label={`Fire at position (${row}, ${col})`}
                    />,
                );
            }
        }

        guessRows.push(
            <div key={row} className="flex">
                {cols}
            </div>,
        );
    }

    const shipRows = [];
    for (let row = 0; row < game.size; row += 1) {
        const cols = [];

        for (let col = 0; col < game.size; col += 1) {
            const positionId = getId(row, col, game.size);
            const ship = game.players[playerId].ships.find((ship) => ship.positions[positionId]);
            const shipPosition = ship?.positions[positionId];

            let type: PositionVariants['type'] = 'water';
            if (shipPosition) {
                if (ship?.sunk) {
                    type = 'sunk';
                } else if (shipPosition.hit) {
                    type = 'hit';
                } else {
                    type = 'ship';
                }
            } else if (game.players[(playerId + 1) % 2].guesses[positionId]) {
                type = 'miss';
            }

            cols.push(<div key={col} className={positionVariants({ type })} />);
        }

        shipRows.push(
            <div key={row} className="flex">
                {cols}
            </div>,
        );
    }

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
                <div className="flex">
                    Player: {playerId}
                    {game.turn === playerId && !game.win ? (
                        <div className="text-blue-600 ml-2">(Te toca!)</div>
                    ) : null}
                </div>

                <div>Score: {game.players[playerId].score}</div>
            </div>

            <fieldset className={guessBoard()} disabled={disabled}>
                {guessRows}
            </fieldset>

            <div className="flex flex-col border-4 border-amber-800">{shipRows}</div>
        </div>
    );
}
