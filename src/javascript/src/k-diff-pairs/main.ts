/**
 * Given an array of integers nums and an integer k, return the number of non-unique k-diff pairs in the array.
 *
 * A k-diff pair is an integer pair (nums[i], nums[j]), where the following are true:
 *
 *   - 0 <= i, j < nums.length
 *   - i != j
 *   - |nums[i] - nums[j]| == k
 *
 * Note that |val| denotes the absolute value of val.
 *
 * Input: nums = [3,1,4,1,5], k = 2
 * Output: 3
 * Explanation: There are two 2-diff pairs in the array, (3,1 (first) ), (3,1 (second)) and (3, 5).
 */

/**
 * Start 1:53pm
 * End   2:01pm
 */
export function countKDiffPairs(nums: number[], k: number): number {
    if (nums.length === 0 || k < 0) {
        return 0;
    }

    let count = 0;

    for (let i = 0; i < nums.length; i += 1) {
        for (let j = i + 1; j < nums.length; j += 1) {
            if (Math.abs(nums[i] - nums[j]) === k) {
                count += 1;
            }
        }
    }

    return count;
}

export function countKDiffPairsV2(nums: number[], k: number): number {
    if (nums.length === 0 || k < 0) {
        return 0;
    }

    let count = 0;
    const numCounts = new Map<number, number>();

    nums.forEach((num) => {
        if (k === 0) {
            if (numCounts.has(num)) {
                count += numCounts.get(num) ?? 0;
            }
        } else {
            if (numCounts.has(num - k)) {
                count += numCounts.get(num - k) ?? 0;
            }
            if (numCounts.has(num + k)) {
                count += numCounts.get(num + k) ?? 0;
            }
        }
        numCounts.set(num, (numCounts.get(num) ?? 0) + 1);
    });

    return count;
}
