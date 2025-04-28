import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Snackbar
import { ActivatedRoute } from '@angular/router';
import { SprintService } from '../services/sprint.service';
import { StatusService } from '../services/status.service';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { SprintProgressChartComponent } from '../sprint-progress-chart/sprint-progress-chart.component';

@Component({
  selector: 'app-project-wise-insight',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule, // ✅ Snackbar module
    SprintProgressChartComponent
  ],
  templateUrl: './project-wise-insight.component.html',
  styleUrls: ['./project-wise-insight.component.css']
})
export class ProjectWiseInsightComponent implements OnInit {
  sprints: any[] = [];
  statusList: any[] = [];
  sprintForm: FormGroup;
  editForm: FormGroup;
  editIndex: number | null = null;
  projectId!: number;
  showChart: boolean = true;

  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar); // ✅ Inject Snackbar
  private sprintService = inject(SprintService);
  private statusService = inject(StatusService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.sprintForm = this.fb.group({
      sprintName: ['', Validators.required],
      sprintStartDate: ['', Validators.required],
      sprintEndDate: ['', Validators.required],
      sprintJira: ['', Validators.required],
      sprintDescription: ['', Validators.required],
      assignedTo: ['', Validators.required],
      sprintFor: [null, Validators.required]
    });

    this.editForm = this.fb.group({
      id: [null],
      sprintName: ['', Validators.required],
      sprintStartDate: ['', Validators.required],
      sprintEndDate: ['', Validators.required],
      sprintJira: ['', Validators.required],
      sprintDescription: ['', Validators.required],
      assignedTo: ['', Validators.required],
      sprintFor: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.projectId = +this.route.snapshot.paramMap.get('id')!;
    this.loadSprints();
    this.loadStatuses();
  }

  loadSprints() {
    this.sprintService.getSprints(this.projectId).subscribe({
      next: (sprints) => {
        this.sprints = [...sprints];
      },
      error: (err) => {
        this.openAlert('error', 'Load Error', 'Failed to load sprints.');
      }
    });
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe({
      next: (statuses: any[]) => {
        this.statusList = statuses;
      },
      error: (err) => {
        this.openAlert('error', 'Load Error', 'Failed to load statuses.');
      }
    });
  }

  addSprint() {
    if (this.sprintForm.valid) {
      const sprintData = {
        ...this.sprintForm.value,
        sprintFor: { id: this.sprintForm.value.sprintFor.id }
      };
      this.sprintService.createSprint(this.projectId, sprintData).subscribe({
        next: (newSprint) => {
          this.sprints = [...this.sprints, newSprint];
          this.sprintForm.reset();
          this.openAlert('success', 'Success', 'Sprint added successfully!');
        },
        error: (err) => {
          this.openAlert('error', 'Save Error', 'Failed to add sprint.');
        }
      });
    } else {
      this.openAlert('error', 'Validation Error', 'Please fill all required fields correctly.');
    }
  }

  enableEdit(index: number) {
    this.editIndex = index;
    const sprint = this.sprints[index];
    this.editForm.setValue({
      id: sprint.id,
      sprintName: sprint.sprintName,
      sprintStartDate: sprint.sprintStartDate,
      sprintEndDate: sprint.sprintEndDate,
      sprintJira: sprint.sprintJira,
      sprintDescription: sprint.sprintDescription,
      assignedTo: sprint.assignedTo,
      sprintFor: sprint.sprintFor
    });
  }

  saveEdit(index: number) {
    if (this.editForm.valid) {
      const sprintId = this.editForm.value.id;
      const sprintData = {
        ...this.editForm.value,
        sprintFor: { id: this.editForm.value.sprintFor.id }
      };
      this.sprintService.updateSprint(sprintId, sprintData).subscribe({
        next: (updatedSprint) => {
          this.sprints = this.sprints.map((s, i) => i === index ? updatedSprint : s);
          this.editIndex = null;
          this.openAlert('success', 'Success', 'Sprint updated successfully!');
        },
        error: (err) => {
          this.openAlert('error', 'Update Error', 'Failed to update sprint.');
        }
      });
    } else {
      this.openAlert('error', 'Validation Error', 'Please fix the errors before saving.');
    }
  }

  cancelEdit() {
    this.editIndex = null;
  }

  confirmDelete(index: number) {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      data: {
        title: 'Confirmation',
        message: `Are you sure you want to delete sprint "${this.sprints[index].sprintName}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        const deletedId = this.sprints[index].id;
        this.sprintService.deleteSprint(deletedId).subscribe({
          next: () => {
            this.sprints = this.sprints.filter((_, i) => i !== index);
            this.openAlert('success', 'Deleted', 'Sprint deleted successfully!');
          },
          error: (err) => {
            this.openAlert('error', 'Delete Error', 'Failed to delete sprint.');
          }
        });
      }
    });
  }

  // ✅ Reusable Snackbar + Alert function
  openAlert(type: 'success' | 'info' | 'error' | 'warning', title: string, message: string) {
    if (type === 'error') {
      this.dialog.open(GenericDialogComponent, {
        data: { title, message, buttonText: 'Close' }
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
}
