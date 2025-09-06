/**
 * https://leetcode.com/problems/best-time-to-buy-and-sell-stock/description/
 *
 * You are given an array of prices where prices[i] is the price of a given stock on the ith day.
 *
 * You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
 *
 * Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.
 *
 *
 * Example 1:
 * Input: prices = [7,1,5,3,6,4]
 * Output: 5
 * Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
 * Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.
 *
 * Example 2:
 * Input: prices = [7,6,4,3,1]
 * Output: 0
 * Explanation: In this case, no transactions are done and the max profit = 0.
 *
 * Space: O(n) where n is the amount of space of the prices
 * Time: O(n^2 - n/2) ~ O(n^2)
 */

function findBestProfit(prices: number[]): number {
    let best = 0;

    for (let i = 0; i < prices.length; i += 1) {
        const buyPrice = prices[i];
        for (let j = i + 1; j < prices.length; j += 1) {
            const sellPrice = prices[j];
            const difference = sellPrice - buyPrice;
            best = Math.max(best, difference);
        }
    }

    return best;
}

// Time: O(n)
function findBestProfit2(prices: number[]): number {
    let best = 0;
    let lowestSoFar = 10000;

    for (let i = 0; i < prices.length; i += 1) {
        const price = prices[i];
        const difference = price - lowestSoFar;
        lowestSoFar = Math.min(lowestSoFar, price);
        best = Math.max(best, difference);
    }

    return best;
}

console.log(findBestProfit([7, 1, 5, 3, 6, 4]));
console.log(findBestProfit([7, 6, 4, 3, 1]));

console.log(findBestProfit2([7, 1, 5, 3, 6, 4]));
console.log(findBestProfit2([7, 6, 4, 3, 1]));

/**
 * Now you are allowed unlimited transactions. So on each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can buy it then immediately sell it on the same day.
 *
 * Find and return the maximum profit you can achieve.
 *
 *
 *
 * Example 1:
 * Input: prices = [7,1,5,3,6,4]
 * Output: 7
 * Explanation: Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
 * Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
 * Total profit is 4 + 3 = 7.
 *
 *
 * Example 2:
 * Input: prices = [1,2,3,4,5]
 * Output: 4
 * Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
 * Total profit is 4.
 *
 * Example 3:
 *
 * Input: prices = [7,6,4,3,1]
 * Output: 0
 * Explanation: There is no way to make a positive profit, so we never buy the stock to achieve the maximum profit of 0.
 */

/**
 * - When the price goes down, reset the buy point.
 * - When the price goes up, sell.
 */
function findBestProfit3(prices: number[]): number {
    let totalProfit = 0;
    let bestBuyDay = 0;

    for (let today = 0; today < prices.length; today += 1) {
        if (
            today + 1 < prices.length &&
            prices[today] < prices[today + 1] &&
            prices[today] < prices[bestBuyDay]
        ) {
            bestBuyDay = today;
        }

        if (bestBuyDay >= 0 && prices[bestBuyDay] < prices[today]) {
            const profit = prices[today] - prices[bestBuyDay];
            totalProfit += profit;
            bestBuyDay = today;
            console.log(`buy: ${prices[bestBuyDay]}, sell: ${prices[today]}, profit: +${profit}`);
        }
    }

    return totalProfit;
}

console.log('expected:', 0, 'actual:', findBestProfit3([]));
console.log('expected:', 0, 'actual:', findBestProfit3([1]));
console.log('expected:', 7, 'actual:', findBestProfit3([7, 1, 5, 3, 6, 4]));
console.log('expected:', 4, 'actual:', findBestProfit3([1, 2, 3, 4, 5]));
console.log('expected:', 0, 'actual:', findBestProfit3([7, 6, 4, 3, 1]));
