import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VelocityService } from '../services/velocity.service';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-velocity-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './velocity-section.component.html',
  styleUrls: ['./velocity-section.component.css'],
  providers: [VelocityService]
})
export class VelocitySectionComponent implements OnInit {
  scrumAreaForm!: FormGroup;
  velocityForm!: FormGroup;
  scrumAreas: any[] = [];
  velocities: any[] = [];
  editingScrumAreaId: number | null = null;
  editingVelocityId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private velocityService: VelocityService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.scrumAreaForm = this.fb.group({
      areaName: ['', Validators.required],
      scrumMaster: ['', Validators.required],
      scrumTeam: ['', Validators.required],
      boardId: ['', Validators.required]
    });

    this.velocityForm = this.fb.group({
      sprintName: ['', Validators.required],
      velocity: [0, [Validators.required, Validators.min(1)]],
      sprintEndDate: ['', Validators.required],
      scrumAreaId: [null, Validators.required]
    });

    this.loadScrumAreas();
    this.loadVelocities();
  }

  openDialog(title: string, message: string) {
    this.dialog.open(AlertComponent, {
      data: { title, message }
    });
  }

  loadScrumAreas() {
    this.velocityService.getScrumAreas().subscribe({
      next: (data) => this.scrumAreas = data,
      error: () => this.openDialog('Error', 'Failed to load Scrum Areas.')
    });
  }

  loadVelocities() {
    this.velocityService.getVelocities().subscribe({
      next: (data) => this.velocities = data,
      error: () => this.openDialog('Error', 'Failed to load Velocities.')
    });
  }

  saveScrumArea() {
    if (this.scrumAreaForm.invalid) {
      this.scrumAreaForm.markAllAsTouched();
      this.openDialog('Validation Error', 'Please fill all required Scrum Area fields.');
      return;
    }

    if (this.editingScrumAreaId) {
      this.velocityService.updateScrumArea(this.editingScrumAreaId, this.scrumAreaForm.value).subscribe({
        next: () => {
          this.snackBar.open('Scrum Area updated successfully!', 'Close', { duration: 3000 });
          this.scrumAreaForm.reset();
          this.editingScrumAreaId = null;
          this.loadScrumAreas();
        },
        error: () => this.openDialog('Error', 'Failed to update Scrum Area.')
      });
    } else {
      this.velocityService.addScrumArea(this.scrumAreaForm.value).subscribe({
        next: () => {
          this.snackBar.open('Scrum Area added successfully!', 'Close', { duration: 3000 });
          this.scrumAreaForm.reset();
          this.loadScrumAreas();
        },
        error: () => this.openDialog('Error', 'Failed to add Scrum Area.')
      });
    }
  }

  editScrumArea(area: any) {
    this.scrumAreaForm.patchValue(area);
    this.editingScrumAreaId = area.id;
  }

  deleteScrumArea(id: number) {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      data: {
        title: 'Delete Scrum Area',
        message: 'Are you sure you want to delete this Scrum Area?',
        buttonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.velocityService.deleteScrumArea(id).subscribe({
          next: () => {
            this.snackBar.open('Scrum Area deleted', 'Close', { duration: 3000 });
            this.loadScrumAreas();
            if (this.editingScrumAreaId === id) {
              this.scrumAreaForm.reset();
              this.editingScrumAreaId = null;
            }
          },
          error: () => this.openDialog('Error', 'Failed to delete Scrum Area.')
        });
      }
    });
  }

  saveVelocity() {
    if (this.velocityForm.invalid) {
      this.velocityForm.markAllAsTouched();
      this.openDialog('Validation Error', 'Please complete all Velocity fields.');
      return;
    }

    const velocityPayload = this.velocityForm.value;

    if (this.editingVelocityId) {
      this.velocityService.updateVelocity(this.editingVelocityId, velocityPayload).subscribe({
        next: () => {
          this.snackBar.open('Velocity updated successfully!', 'Close', { duration: 3000 });
          this.velocityForm.reset();
          this.editingVelocityId = null;
          this.loadVelocities();
        },
        error: () => this.openDialog('Error', 'Failed to update Velocity.')
      });
    } else {
      const { scrumAreaId, ...payload } = velocityPayload;
      this.velocityService.addVelocity(scrumAreaId, payload).subscribe({
        next: () => {
          this.snackBar.open('Velocity added successfully!', 'Close', { duration: 3000 });
          this.velocityForm.reset();
          this.loadVelocities();
        },
        error: () => this.openDialog('Error', 'Failed to add Velocity.')
      });
    }
  }

  editVelocity(v: any) {
    this.velocityForm.patchValue({
      scrumAreaId: v.scrumArea?.id,
      sprintName: v.sprintName,
      velocity: v.velocity,
      sprintEndDate: v.sprintEndDate
    });
    this.editingVelocityId = v.id;
  }

  deleteVelocity(id: number) {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      data: {
        title: 'Delete Velocity',
        message: 'Are you sure you want to delete this Velocity entry?',
        buttonText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.velocityService.deleteVelocity(id).subscribe({
          next: () => {
            this.snackBar.open('Velocity deleted successfully', 'Close', { duration: 3000 });
            this.loadVelocities();
          },
          error: () => this.openDialog('Error', 'Failed to delete Velocity.')
        });
      }
    });
  }
}
