
import { StockAnnualPerformance } from './stock-annual-performance';

export interface AnnualPerformance {
    openingPortfolioValue: number;
    closingPortfolioValue: number;
    netCashFlowInYear: number;
    percentageGain: number;
    grossProfit: number;
    netProfit: number;
    totalDividends: number;
    totalInterest: number;
    stockAnnualPerformances: { [key: string]: StockAnnualPerformance };
}
