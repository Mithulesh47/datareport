import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaWiseProjectChartComponent } from './area-wise-project-chart.component';

describe('AreaWiseProjectChartComponent', () => {
  let component: AreaWiseProjectChartComponent;
  let fixture: ComponentFixture<AreaWiseProjectChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaWiseProjectChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaWiseProjectChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
