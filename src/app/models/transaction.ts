
import { Stock } from "./stock";

export interface Transaction {
    id: number;
    stock: Stock;
    transactionDate: Date;
    transactionType: string;
    price: number;
    units: number;
    currency: string;
}
