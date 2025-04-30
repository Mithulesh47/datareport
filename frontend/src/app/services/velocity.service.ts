import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VelocityService {

  private baseUrl = 'http://localhost:8080/api/velocities';

  constructor(private http: HttpClient) {}

  // ──────── SCRUM AREA ────────

  getScrumAreas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl.replace('/velocities', '')}/scrum-areas`);
  }

  addScrumArea(scrumArea: any): Observable<any> {
    return this.http.post(`${this.baseUrl.replace('/velocities', '')}/scrum-areas`, scrumArea);
  }

  updateScrumArea(id: number, scrumArea: any): Observable<any> {
    return this.http.put(`${this.baseUrl.replace('/velocities', '')}/scrum-areas/${id}`, scrumArea);
  }

  deleteScrumArea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl.replace('/velocities', '')}/scrum-areas/${id}`);
  }

  // ──────── VELOCITY ────────

  getVelocities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }

  getVelocitiesByScrumArea(areaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/scrum-area/${areaId}`);
  }

  addVelocity(areaId: number, velocity: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${areaId}`, velocity);
  }

  updateVelocity(id: number, velocity: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, velocity);
  }

  deleteVelocity(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ──────── NEW FOR VELOCITY PLOT ────────

  getVelocityChartData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/chart-data`);
  }
}
