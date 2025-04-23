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
import { AreaService } from '../services/area.service';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';

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
    MatDialogModule
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

  addArea() {
    if (this.areaForm.valid) {
      this.areaService.addArea(this.areaForm.value).subscribe((newArea) => {
        this.areas.push(newArea);
        this.areaForm.reset();
      });
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
      this.areaService.updateArea(this.editForm.value).subscribe(updatedArea => {
        this.areas[index] = updatedArea;
        this.editIndex = null;
      });
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
        });
      }
    });
  }
}
