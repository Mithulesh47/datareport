import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Sprint {
  id?: number;
  sprintName: string;
  sprintStartDate: Date | string;
  sprintEndDate: Date | string;
  sprintJira: string;
  sprintDescription: string;
  assignedTo: string;
  sprintFor: {
    id: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  private baseUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) {}

  // Create sprint
  createSprint(projectId: number, sprint: Sprint): Observable<Sprint> {
    return this.http.post<Sprint>(`${this.baseUrl}/${projectId}/sprints`, sprint);
  }

  // Get all sprints for a project
  getSprints(projectId: number): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.baseUrl}/${projectId}/sprints`);
  }

  // Get sprint by ID
  getSprintById(sprintId: number): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.baseUrl}/sprints/${sprintId}`);
  }

  // Update sprint
  updateSprint(sprintId: number, sprint: Sprint): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.baseUrl}/sprints/${sprintId}`, sprint);
  }

  // Delete sprint
  deleteSprint(sprintId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sprints/${sprintId}`);
  }
}
