import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interest } from '../models/interest';
import { InterestRequestPayload } from '../models/interest-request-payload';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  private apiUrl = `http://localhost:${environment.backendPort}/api/interests`;

  constructor(private http: HttpClient) { }

  getInterests(): Observable<Interest[]> {
    return this.http.get<Interest[]>(this.apiUrl);
  }

  private toInterestRequestPayload(interest: Interest): InterestRequestPayload {
    const date = interest.interestDate;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return {
      interestDate: formattedDate, // Convert Date to string
      interestAmount: interest.interestAmount,
      broker: interest.broker,
      currency: interest.currency
    };
  }

  addInterest(interest: Interest): Observable<Interest> {
    const requestBody = this.toInterestRequestPayload(interest);
    return this.http.post<Interest>(this.apiUrl, requestBody);
  }

  updateInterest(id: number, interest: Interest): Observable<Interest> {
    const requestBody = this.toInterestRequestPayload(interest);
    return this.http.put<Interest>(`${this.apiUrl}/${id}`, requestBody);
  }

  deleteInterest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}