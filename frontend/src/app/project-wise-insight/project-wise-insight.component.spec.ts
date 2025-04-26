import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectWiseInsightComponent } from './project-wise-insight.component';

describe('ProjectWiseInsightComponent', () => {
  let component: ProjectWiseInsightComponent;
  let fixture: ComponentFixture<ProjectWiseInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectWiseInsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectWiseInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
