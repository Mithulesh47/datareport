import { Routes } from '@angular/router';
import { AreaManagerComponent } from './area-manager/area-manager.component';
import { StatusManagerComponent } from './status-manager/status-manager.component';
import { ProjectAddComponent } from './project-add/project-add.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';  // Import the new edit component

export const routes: Routes = [
  { path: 'area-manager', component: AreaManagerComponent },
  { path: 'status-manager', component: StatusManagerComponent },
  { path: 'project-add', component: ProjectAddComponent },
  { path: 'edit-project/:id', component: ProjectEditComponent },  // Add route for editing project
  { path: '', component: ProjectViewComponent }, 
];
