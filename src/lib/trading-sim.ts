// Purely illustrative simulation on synthetic (random-walk) price data.
// No real market data, no live trading, no financial advice.

export type PricePoint = { day: number; price: number };

export function generateSyntheticPrices(days: number, startPrice = 100, volatility = 1.5, drift = 0.05): PricePoint[] {
  const prices: PricePoint[] = [{ day: 0, price: startPrice }];
  let price = startPrice;
  for (let day = 1; day < days; day++) {
    const change = (Math.random() - 0.5) * volatility + drift;
    price = Math.max(1, price + change);
    prices.push({ day, price: Number(price.toFixed(2)) });
  }
  return prices;
}

function movingAverage(prices: PricePoint[], window: number): (number | null)[] {
  return prices.map((_, i) => {
    if (i < window - 1) return null;
    const slice = prices.slice(i - window + 1, i + 1);
    return slice.reduce((sum, p) => sum + p.price, 0) / window;
  });
}

export type SimResult = {
  chartData: { day: number; price: number; strategy: number; buyHold: number }[];
  trades: number;
  wins: number;
  totalReturnPct: number;
  buyHoldReturnPct: number;
};

export function runMovingAverageCrossover(
  prices: PricePoint[],
  shortWindow: number,
  longWindow: number,
  startingCash = 10000,
): SimResult {
  const shortMA = movingAverage(prices, shortWindow);
  const longMA = movingAverage(prices, longWindow);

  let cash = startingCash;
  let shares = 0;
  let inPosition = false;
  let trades = 0;
  let wins = 0;
  let lastBuyPrice = 0;

  const buyHoldShares = startingCash / prices[0].price;

  const chartData = prices.map((p, i) => {
    const s = shortMA[i];
    const l = longMA[i];
    const prevS = i > 0 ? shortMA[i - 1] : null;
    const prevL = i > 0 ? longMA[i - 1] : null;

    if (s !== null && l !== null && prevS !== null && prevL !== null) {
      const crossedUp = prevS <= prevL && s > l;
      const crossedDown = prevS >= prevL && s < l;

      if (crossedUp && !inPosition) {
        shares = cash / p.price;
        cash = 0;
        inPosition = true;
        lastBuyPrice = p.price;
        trades++;
      } else if (crossedDown && inPosition) {
        cash = shares * p.price;
        if (p.price > lastBuyPrice) wins++;
        shares = 0;
        inPosition = false;
      }
    }

    const portfolioValue = cash + shares * p.price;
    return {
      day: p.day,
      price: p.price,
      strategy: Number(portfolioValue.toFixed(2)),
      buyHold: Number((buyHoldShares * p.price).toFixed(2)),
    };
  });

  const finalValue = chartData[chartData.length - 1].strategy;
  const finalBuyHold = chartData[chartData.length - 1].buyHold;

  return {
    chartData,
    trades,
    wins,
    totalReturnPct: ((finalValue - startingCash) / startingCash) * 100,
    buyHoldReturnPct: ((finalBuyHold - startingCash) / startingCash) * 100,
  };
}
