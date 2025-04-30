import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VelocityPlotComponent } from './velocity-plot.component';

describe('VelocityPlotComponent', () => {
  let component: VelocityPlotComponent;
  let fixture: ComponentFixture<VelocityPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VelocityPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VelocityPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
