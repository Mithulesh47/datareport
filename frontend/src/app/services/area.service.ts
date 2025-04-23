// src/app/services/area.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Area {
  id: number;
  name: string;
  leadName: string;
  leadEmail: string;
}

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private apiUrl = 'http://localhost:8080/api/areas';  
  constructor(private http: HttpClient) {}

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl);
  }

  addArea(area: Area): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, area);
  }

  updateArea(area: Area): Observable<Area> {
    return this.http.put<Area>(`${this.apiUrl}/${area.id}`, area);
  }

  deleteArea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
