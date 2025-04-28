import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Snackbar
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // ✅ Import Dialog
import { ProjectService } from '../services/project.service';
import { AlertComponent } from '../alert/alert.component'; // ✅ Import AlertComponent

@Component({
  selector: 'app-project-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule, // ✅ Add Snackbar module
    MatDialogModule    // ✅ Add Dialog module
  ],
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {
  projectForm!: FormGroup;
  areaList: any[] = [];
  statusList: any[] = [];

  private projectService = inject(ProjectService);
  private snackBar = inject(MatSnackBar); // ✅ Inject Snackbar
  private dialog = inject(MatDialog);     // ✅ Inject Dialog

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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
  }

  loadAreaList(): void {
    this.projectService.getAreas().subscribe({
      next: (data) => (this.areaList = data),
      error: (err) => {
        this.openAlert('error', 'Load Error', 'Failed to load areas.');
      }
    });
  }

  loadStatusList(): void {
    this.projectService.getStatuses().subscribe({
      next: (data) => (this.statusList = data),
      error: (err) => {
        this.openAlert('error', 'Load Error', 'Failed to load statuses.');
      }
    });
  }

  // ✅ Reusable Alert/Snackbar function
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

      const projectData = {
        projectName: formValue.projectName,
        description: formValue.description,
        developer: formValue.developer,
        jira: formValue.jira,
        startDate: formValue.startDate,
        endDate: formValue.endDate,
        area: { id: formValue.areaId },
        status: { id: formValue.statusId }
      };

      this.projectService.addProject(projectData).subscribe({
        next: (res) => {
          this.openAlert('success', 'Success', 'Project saved successfully!');
          this.projectForm.reset();
        },
        error: (err) => {
          this.openAlert('error', 'Save Error', 'Failed to save project.');
        }
      });
    } else {
      this.openAlert('error', 'Validation Error', 'Please fill all required fields correctly.');
    }
  }
}
