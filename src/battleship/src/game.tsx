/**
 * Data:
 * State - win/end
 * Players
 *  - Board
 */
import { useState } from 'react';

import { Battleship } from './game-state';
import { PlayerDisplay } from './player';

export function Game() {
    const [, setRender] = useState(false);
    const [game] = useState(new Battleship());

    return (
        <div className="flex flex-col m-4 space-y-4">
            {game.win ? (
                <div className="text-green-700">Player {(game.turn + 1) % 2} wins!</div>
            ) : null}

            <div className="flex space-x-4">
                <PlayerDisplay game={game} player={0} onUpdate={() => setRender((v) => !v)} />
                <PlayerDisplay game={game} player={1} onUpdate={() => setRender((v) => !v)} />
            </div>
        </div>
    );
}
