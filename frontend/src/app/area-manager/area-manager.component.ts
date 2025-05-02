import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import Snackbar
import { AreaService } from '../services/area.service';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-area-manager',
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
    MatSnackBarModule // ✅ Add this
  ],
  templateUrl: './area-manager.component.html',
  styleUrls: ['./area-manager.component.css']
})
export class AreaManagerComponent {
  areas: any[] = [];
  areaForm: FormGroup;
  editForm: FormGroup;
  editIndex: number | null = null;

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar); // ✅ Inject Snackbar
  private areaService = inject(AreaService);

  constructor(private fb: FormBuilder) {
    this.areaForm = this.fb.group({
      name: ['', Validators.required],
      leadName: ['', Validators.required],
      leadEmail: ['', [Validators.required, Validators.email]]
    });

    this.editForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      leadName: ['', Validators.required],
      leadEmail: ['', [Validators.required, Validators.email]]
    });

    this.loadAreas();
  }

  loadAreas() {
    this.areaService.getAreas().subscribe(areas => {
      this.areas = areas;
    });
  }


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

  addArea() {
    if (this.areaForm.valid) {
      this.areaService.addArea(this.areaForm.value).subscribe((newArea) => {
        this.areas.push(newArea);
        this.areaForm.reset();
        this.openAlert('success', 'Success', 'Area added successfully!');
      });
    } else {
      let errorMessages = [];

      if (this.areaForm.get('name')?.hasError('required')) {
        errorMessages.push('Area Name is required.');
      }
      if (this.areaForm.get('leadName')?.hasError('required')) {
        errorMessages.push('Lead Name is required.');
      }
      if (this.areaForm.get('leadEmail')?.hasError('required')) {
        errorMessages.push('Lead Email is required.');
      } else if (this.areaForm.get('leadEmail')?.hasError('email')) {
        errorMessages.push('Lead Email is invalid.');
      }

      this.openAlert('error', 'Validation Error', errorMessages.join('\n'));
    }
  }

  enableEdit(index: number) {
    this.editIndex = index;
    const area = this.areas[index];
    this.editForm.setValue({
      id: area.id,
      name: area.name,
      leadName: area.leadName,
      leadEmail: area.leadEmail
    });
  }

saveEdit(index: number) {
  if (this.editForm.valid) {
    this.areaService.updateArea(this.editForm.value).subscribe({
      next: (updatedArea) => {
        this.areas[index] = updatedArea;
        this.editIndex = null;
        this.openAlert('success', 'Success', 'Area updated successfully!');
      },
      error: (err) => {
        const message = err.error.message?.[0]?.split(":")[1]?.trim() || 'Failed to update area. Please try again.';
        this.openAlert('error', 'Update Failed', message);
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
        message: `Are you sure you want to delete "${this.areas[index].name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.areaService.deleteArea(this.areas[index].id).subscribe(() => {
          this.areas.splice(index, 1);
          this.openAlert('success', 'Deleted', 'Area deleted successfully!');
        });
      }
    });
  }
}
