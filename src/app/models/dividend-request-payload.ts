
export interface DividendRequestPayload {
    stockTicker: string;
    dividendDate: string;
    units: number;
    dividendPerShare: number;
    currency: string;
}
