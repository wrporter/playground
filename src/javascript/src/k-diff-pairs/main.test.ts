import { countKDiffPairs, countKDiffPairsV2 } from './main.js';

const tests = [
    {
        input: { nums: [], k: 0 },
        want: 0,
    },
    {
        input: { nums: [3, 1, 4, 1, 5], k: 2 },
        want: 3,
    },
    {
        input: { nums: [1, 2, 3, 4, 5], k: 1 },
        want: 4,
    },
    {
        input: { nums: [3, 1, 1, 3, 4, 5, 6], k: 2 },
        want: 7,
    },
    {
        input: { nums: [3, 1, 1, 3, 4, 5, 6], k: 0 },
        want: 2,
    },
    {
        input: { nums: [1, 1, 1, 1], k: 0 },
        want: 6,
    },
    {
        input: { nums: [1, 1, 1, 1, 1, 1], k: 0 },
        want: 15,
    },
];

it.each(tests)('countKDiffPairs - %#', ({ input: { nums, k }, want }) => {
    expect(countKDiffPairs(nums, k)).toEqual(want);
});

it.each(tests)('countKDiffPairsV2 - %#', ({ input: { nums, k }, want }) => {
    expect(countKDiffPairsV2(nums, k)).toEqual(want);
});
