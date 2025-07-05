
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from '../models/stock';
import { StockRequestPayload } from '../models/stock-request-payload';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private apiUrl = `http://localhost:${environment.backendPort}/api/stocks`;

  constructor(private http: HttpClient) { }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  private toStockRequestPayload(stock: Stock): StockRequestPayload {
    return {
      ticker: stock.ticker,
      name: stock.name,
      baseCurrency: stock.baseCurrency
    };
  }

  addStock(stock: Stock): Observable<Stock> {
    const requestBody = this.toStockRequestPayload(stock);
    return this.http.post<Stock>(this.apiUrl, requestBody);
  }

  updateStock(ticker: string, stock: Stock): Observable<Stock> {
    const requestBody = this.toStockRequestPayload(stock);
    return this.http.put<Stock>(`${this.apiUrl}/${ticker}`, requestBody);
  }

  deleteStock(ticker: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ticker}`);
  }
}
