import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Snackbar
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ Import Dialog
import { AlertComponent } from '../alert/alert.component'; // ✅ Import AlertComponent
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
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSnackBarModule, // ✅ Snackbar
    MatDialogModule    // ✅ Dialog
  ],
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  projectForm!: FormGroup;
  areaList: any[] = [];
  statusList: any[] = [];
  projectId: string = '';

  private projectService = inject(ProjectService);
  private areaService = inject(AreaService);
  private statusService = inject(StatusService);
  private snackBar = inject(MatSnackBar); // ✅ Inject Snackbar
  private dialog = inject(MatDialog);     // ✅ Inject Dialog
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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

  loadAreaList(): void {
    this.areaService.getAreas().subscribe({
      next: (data) => (this.areaList = data),
      error: (err) => {
        this.openAlert('error', 'Load Error', 'Failed to load areas.');
      }
    });
  }

  loadStatusList(): void {
    this.statusService.getStatuses().subscribe({
      next: (data) => (this.statusList = data),
      error: (err) => {
        this.openAlert('error', 'Load Error', 'Failed to load statuses.');
      }
    });
  }

  loadProjectDetails(): void {
    const projectIdAsNumber = +this.projectId;
    this.projectService.getProjectById(projectIdAsNumber).subscribe({
      next: (project: Project) => {
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
      error: (err) => {
        this.openAlert('error', 'Load Error', 'Failed to load project details.');
      }
    });
  }

  // ✅ Reusable function
  openAlert(type: 'success' | 'info' | 'error' | 'warning', title: string, message: string) {
    if (type === 'error') {
      this.dialog.open(AlertComponent, {
        data: { title, message }
      });
    } else {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });
    }
  }

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

      const projectIdAsNumber = +this.projectId;

      this.projectService.editProject(projectIdAsNumber, updatedProject).subscribe({
        next: (res) => {
          this.openAlert('success', 'Success', 'Project updated successfully!');
          this.router.navigate(['/']); // ✅ Navigate back
        },
        error: (err) => {
          this.openAlert('error', 'Save Error', 'Failed to update project.');
        }
      });
    } else {
      this.openAlert('error', 'Validation Error', 'Please fill all required fields correctly.');
    }
  }
}
