const DIRECTIONS = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
];

interface Point {
    x: number;
    y: number;
}

export function numIslands(grid: string[][]): number {
    const seen = new Set<number>();
    let count = 0;

    // find a 1
    for (let y = 0; y < grid.length; y += 1) {
        for (let x = 0; x < grid[y].length; x += 1) {
            const id = getId(grid, { x, y });

            if (grid[y][x] === '1' && !seen.has(id)) {
                count += 1;
                seen.add(id);

                // flood-fill from the 1
                const queue: Point[] = [{ x, y }];

                while (queue.length > 0) {
                    const current = queue.shift() as Point;

                    for (let i = 0; i < DIRECTIONS.length; i += 1) {
                        const d = DIRECTIONS[i];
                        const next = { x: current.x + d.x, y: current.y + d.y };
                        const nextId = getId(grid, next);

                        if (
                            next.y >= 0 &&
                            next.y < grid.length &&
                            next.x >= 0 &&
                            next.x < grid[next.y].length &&
                            grid[next.y][next.x] === '1' &&
                            !seen.has(nextId)
                        ) {
                            seen.add(nextId);
                            queue.push(next);
                        }
                    }
                }
            }
        }
    }

    return count;
}

function getId(grid: string[][], { x, y }: Point): number {
    return y * grid[0].length + x;
}
