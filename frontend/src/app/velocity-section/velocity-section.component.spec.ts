import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VelocitySectionComponent } from './velocity-section.component';

describe('VelocitySectionComponent', () => {
  let component: VelocitySectionComponent;
  let fixture: ComponentFixture<VelocitySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VelocitySectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VelocitySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
