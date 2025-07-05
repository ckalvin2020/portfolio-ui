
export interface TransactionRequestPayload {
    stockTicker: string;
    transactionDate: string;
    transactionType: string;
    price: number;
    units: number;
    currency: string;
    cost?: number;
}
