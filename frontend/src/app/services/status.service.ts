import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Status {
  id: number;
  statusName: string;
  percentage: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiUrl = 'http://localhost:8080/api/statuses';  

  constructor(private http: HttpClient) {}

  getStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(this.apiUrl);
  }

  addStatus(status: Status): Observable<Status> {
    return this.http.post<Status>(this.apiUrl, status);
  }

  updateStatus(status: Status): Observable<Status> {
    return this.http.put<Status>(`${this.apiUrl}/${status.id}`, status);
  }

  deleteStatus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
