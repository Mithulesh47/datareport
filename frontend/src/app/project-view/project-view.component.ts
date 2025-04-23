import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { AreaService, Area } from '../services/area.service';
import { MatDialog } from '@angular/material/dialog';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-project-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.css']
})
export class ProjectViewComponent implements OnInit {
  displayedColumns: string[] = [
    'projectName',
    'description',
    'developer',
    'jira',
    'startDate',
    'endDate',
    'status',
    'actions'
  ];

  dataSource: any[] = [];
  groupedProjects: { [areaName: string]: any[] } = {};
  areaNames: string[] = [];
  error: boolean = false;
  loading: boolean = true;

  constructor(
    private projectService: ProjectService,
    private areaService: AreaService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadAreas();
  }

  loadProjects(): void {
    this.loading = true;
    this.projectService.getAllProjects().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.groupProjectsByArea();
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.error = true;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadAreas(): void {
    this.areaService.getAreas().subscribe({
      next: (areas) => {
        this.areaNames = areas.map((area: Area) => area.name);
        this.groupProjectsByArea();
      },
      error: (err) => {
        console.error('Error fetching areas:', err);
        this.error = true;
      }
    });
  }

  groupProjectsByArea(): void {
    this.groupedProjects = {};
    for (const areaName of this.areaNames) {
      this.groupedProjects[areaName] = this.dataSource.filter(
        project => project.area?.name === areaName
      );
    }
  }

  editProject(project: any): void {
    this.router.navigate(['/edit-project', project.id]);
  }

  deleteProject(project: any): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the project: ${project.projectName}?`,
        buttonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(project.id).subscribe({
          next: () => {
            console.log('Project deleted:', project);
            this.loadProjects();
          },
          error: (err) => {
            console.error('Error deleting project:', err);
          }
        });
      }
    });
  }
}
