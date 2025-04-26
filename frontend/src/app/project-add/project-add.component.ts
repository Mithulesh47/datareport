import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../services/project.service';
import { MatCard, MatCardActions, MatCardModule } from '@angular/material/card';

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
    MatCardModule
  ],
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.css']
})
export class ProjectAddComponent implements OnInit {
  projectForm!: FormGroup;
  areaList: any[] = [];
  statusList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService
  ) {}

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
      error: (err) => console.error('Error loading areas', err)
    });
  }

  loadStatusList(): void {
    this.projectService.getStatuses().subscribe({
      next: (data) => (this.statusList = data),
      error: (err) => console.error('Error loading statuses', err)
    });
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
          console.log('Project saved successfully', res);
          this.projectForm.reset();
        },
        error: (err) => {
          console.error('Error saving project', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
