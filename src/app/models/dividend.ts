
import { Stock } from "./stock";

export interface Dividend {
    id?: number;
    stock: Stock;
    dividendDate: Date;
    units: number;
    dividendPerShare: number;
    totalDividend: number;
    currency: string;
}
