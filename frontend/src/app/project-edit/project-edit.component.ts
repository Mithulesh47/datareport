import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../services/project.service';
import { AreaService } from '../services/area.service';
import { StatusService } from '../services/status.service'; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';  // Add this import
import { ReactiveFormsModule } from '@angular/forms';  // Add this import
import { Project } from '../models/project.model';  

@Component({
  selector: 'app-project-edit',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    CommonModule,  // Add this line
    ReactiveFormsModule  // Add this line
  ],
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  projectForm!: FormGroup;
  areaList: any[] = [];
  statusList: any[] = [];
  projectId: string = '';  // Keep this as a string from the route

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private areaService: AreaService,
    private statusService: StatusService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get project ID from the route params
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id')!;

    this.projectForm = this.fb.group({
      areaId: ['', Validators.required],
      projectName: ['', Validators.required],
      description: [''],
      developer: ['', Validators.required],
      jira: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      statusId: ['', Validators.required]
    });

    this.loadAreaList();
    this.loadStatusList();
    this.loadProjectDetails();
  }

  // Load area list for the dropdown
  loadAreaList(): void {
    this.areaService.getAreas().subscribe({
      next: (data) => (this.areaList = data),
      error: (err) => console.error('Error loading areas', err)
    });
  }

  // Load status list for the dropdown
  loadStatusList(): void {
    this.statusService.getStatuses().subscribe({
      next: (data) => (this.statusList = data),
      error: (err) => console.error('Error loading statuses', err)
    });
  }

  // Load the details of the project to edit
  loadProjectDetails(): void {
    // Convert projectId to number before passing to the service
    const projectIdAsNumber = +this.projectId;  // Convert to number

    this.projectService.getProjectById(projectIdAsNumber).subscribe({
      next: (project: Project) => {
        // Populate the form with existing project data
        this.projectForm.patchValue({
          areaId: project.area?.id,
          projectName: project.projectName,
          description: project.description,
          developer: project.developer,
          jira: project.jira,
          startDate: new Date(project.startDate),
          endDate: new Date(project.endDate),
          statusId: project.status?.id
        });
      },
      error: (err) => console.error('Error fetching project details', err)
    });
  }

  // Handle the form submission
  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const updatedProject = {
        projectName: formValue.projectName,
        description: formValue.description,
        developer: formValue.developer,
        jira: formValue.jira,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        area: { id: formValue.areaId },
        status: { id: formValue.statusId }
      };

      // Convert projectId to number before passing it to the service
      const projectIdAsNumber = +this.projectId;  // Convert to number

      // Send the updated project data to the service
      this.projectService.editProject(projectIdAsNumber, updatedProject).subscribe({
        next: (res) => {
          console.log('Project updated successfully', res);
          this.router.navigate(['/']);  // Navigate back to the project view page
        },
        error: (err) => {
          console.error('Error updating project', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
