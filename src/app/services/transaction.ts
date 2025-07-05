
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { TransactionRequestPayload } from '../models/transaction-request-payload';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = `http://localhost:${environment.backendPort}/api/transactions`;

  constructor(private http: HttpClient) { }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  private toTransactionRequestPayload(transaction: Transaction): TransactionRequestPayload {
    const date = transaction.transactionDate;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return {
      stockTicker: transaction.stock.ticker,
      transactionDate: formattedDate,
      transactionType: transaction.transactionType,
      price: transaction.price,
      units: transaction.units,
      currency: transaction.currency,
      cost: (transaction as any).cost // Assuming cost might be present in the Transaction object
    };
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    const requestBody = this.toTransactionRequestPayload(transaction);
    return this.http.post<Transaction>(this.apiUrl, requestBody);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    const requestBody = this.toTransactionRequestPayload(transaction);
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, requestBody);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
