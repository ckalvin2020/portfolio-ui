
export interface StockProfitLoss {
    name: string;
    totalCost: number;
    totalUnits: number;
    currentValue: number;
    grossProfit: number;
    netProfit: number;
    totalDividends: number;
    averageCost: number;
    peRatio?: number;
    divYield?: number;
}
