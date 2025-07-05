
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dividend } from '../models/dividend';
import { DividendRequestPayload } from '../models/dividend-request-payload';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DividendService {

  private apiUrl = `http://localhost:${environment.backendPort}/api/dividends`;

  constructor(private http: HttpClient) { }

  getDividends(): Observable<Dividend[]> {
    return this.http.get<Dividend[]>(this.apiUrl);
  }

  private toDividendRequestPayload(dividend: Dividend): DividendRequestPayload {
    const date = dividend.dividendDate;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return {
      stockTicker: dividend.stock.ticker,
      dividendDate: formattedDate, // Use locally formatted date
      units: dividend.units,
      dividendPerShare: dividend.dividendPerShare,
      currency: dividend.currency
    };
  }

  addDividend(dividend: Dividend): Observable<Dividend> {
    const requestBody = this.toDividendRequestPayload(dividend);
    return this.http.post<Dividend>(this.apiUrl, requestBody);
  }

  updateDividend(id: number, dividend: Dividend): Observable<Dividend> {
    const requestBody = this.toDividendRequestPayload(dividend);
    return this.http.put<Dividend>(`${this.apiUrl}/${id}`, requestBody);
  }

  deleteDividend(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
