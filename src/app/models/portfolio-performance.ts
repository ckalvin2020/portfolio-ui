
import { StockProfitLoss } from './stock-profit-loss';

export interface PortfolioPerformance {
    portfolioCapital: number;
    portfolioMarketValue: number;
    grossProfit: number;
    netProfit: number;
    totalDividends: number;
    totalInterest: number;
    stockPerformances: { [key: string]: StockProfitLoss };
    averagePe?: number;
    averageDivYield?: number;
}
