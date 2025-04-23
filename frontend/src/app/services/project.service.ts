import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Area } from '../models/area.model';
import { Status } from '../models/status.model';

export interface Project {
  id: number;
  projectName: string;
  description: string;
  developer: string;
  jira: string;
  startDate: string; 
  endDate: string;   
  area: Area;
  status: Status;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) {}

  // Get all areas
  getAreas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/areas`);
  }

  // Get all statuses
  getStatuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/statuses`);
  }

  // Add a new project
  addProject(projectData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects`, projectData);
  }

  // Get all projects
  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/projects`);
  }

  // Edit a project
  editProject(projectId: number, projectData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${projectId}`, projectData);
  }

  // Delete a project
  deleteProject(projectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${projectId}`);
  }

   // Get a project by ID
  getProjectById(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/projects/${projectId}`);
  }
}
