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
import { StatusService } from '../services/status.service';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';

@Component({
  selector: 'app-status-manager',
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
    MatDialogModule
  ],
  templateUrl: './status-manager.component.html',
  styleUrls: ['./status-manager.component.css']
})
export class StatusManagerComponent {
  statuses: any[] = [];
  statusForm: FormGroup;
  editForm: FormGroup;
  editIndex: number | null = null;
  deleteIndex: number | null = null;
  sortAscending: boolean = true;

  private dialog = inject(MatDialog);
  private statusService = inject(StatusService);

  constructor(private fb: FormBuilder) {
    this.statusForm = this.fb.group({
      statusName: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.editForm = this.fb.group({
      id: [null],
      statusName: ['', Validators.required],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.loadStatuses();
  }

  loadStatuses() {
    this.statusService.getStatuses().subscribe(statuses => {
      this.statuses = statuses;
      this.sortStatuses();
    });
  }

  addStatus() {
    if (this.statusForm.valid) {
      this.statusService.addStatus(this.statusForm.value).subscribe((newStatus) => {
        this.statuses.push(newStatus);
        this.sortStatuses();
        this.statusForm.reset();
      });
    }
  }

  enableEdit(index: number) {
    this.editIndex = index;
    const status = this.statuses[index];
    this.editForm.setValue({
      id: status.id,
      statusName: status.statusName,
      percentage: status.percentage
    });
  }

  saveEdit(index: number) {
    if (this.editForm.valid) {
      this.statusService.updateStatus(this.editForm.value).subscribe(updatedStatus => {
        this.statuses[index] = updatedStatus;
        this.sortStatuses();
        this.editIndex = null;
      });
    }
  }

  cancelEdit() {
    this.editIndex = null;
  }

  confirmDelete(index: number) {
    this.deleteIndex = index;
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this status?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.statusService.deleteStatus(this.statuses[index].id).subscribe(() => {
          this.statuses.splice(index, 1);
          this.sortStatuses();
        });
      }
      this.deleteIndex = null;
    });
  }

  sortStatuses() {
    this.statuses.sort((a, b) => {
      return this.sortAscending ? a.percentage - b.percentage : b.percentage - a.percentage;
    });
  }

  toggleSortOrder() {
    this.sortAscending = !this.sortAscending;
    this.sortStatuses();
  }
}
