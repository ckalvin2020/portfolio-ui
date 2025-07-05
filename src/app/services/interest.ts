import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interest } from '../models/interest';
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
}