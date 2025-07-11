import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioPerformance } from '../models/portfolio-performance';
import { AnnualPerformance } from '../models/annual-performance';
import { OverallPerformance } from '../models/overall-performance';
import { DailyPerformance } from '../models/daily-performance';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private apiUrl = `http://localhost:${environment.backendPort}/api/portfolio/performance`;

  constructor(private http: HttpClient) { }

  getTotalPortfolioPerformance(currency?: string, baseCurrency?: string): Observable<PortfolioPerformance> {
    let params = new HttpParams();
    if (currency) {
      params = params.append('currency', currency);
    }
    if (baseCurrency) {
      params = params.append('baseCurrency', baseCurrency);
    }
    return this.http.get<PortfolioPerformance>(`${this.apiUrl}/total`, { params });
  }

  getAnnualPerformance(year: number, currency?: string, baseCurrency?: string): Observable<AnnualPerformance> {
    let params = new HttpParams();
    if (currency) {
      params = params.append('currency', currency);
    }
    if (baseCurrency) {
      params = params.append('baseCurrency', baseCurrency);
    }
    return this.http.get<AnnualPerformance>(`${this.apiUrl}/annual/${year}`, { params });
  }

  getOverallPerformance(currency?: string, baseCurrency?: string): Observable<OverallPerformance> {
    let params = new HttpParams();
    if (currency) {
      params = params.append('currency', currency);
    }
    if (baseCurrency) {
      params = params.append('baseCurrency', baseCurrency);
    }
    return this.http.get<OverallPerformance>(`${this.apiUrl}/yearly`, { params });
  }

  getDailyPerformance(dateFrom: string, dateTo: string, stockTicker?: string, currency?: string): Observable<DailyPerformance[]> {
    let params = new HttpParams()
      .append('dateFrom', dateFrom)
      .append('dateTo', dateTo);
    if (stockTicker) {
      params = params.append('stockTicker', stockTicker);
    }
    if (currency) {
      params = params.append('currency', currency);
    }
    return this.http.get<DailyPerformance[]>(`${this.apiUrl}/daily`, { params });
  }
}