import { YearlyPerformance } from './yearly-performance';

export interface OverallPerformance {
    openingValue: number;
    closingValue: number;
    grossProfit: number;
    netProfit: number;
    dividends: number;
    interest: number;
    netCashFlow: number;
    overallXirr: number;
    yearlyPerformances: YearlyPerformance[];
}