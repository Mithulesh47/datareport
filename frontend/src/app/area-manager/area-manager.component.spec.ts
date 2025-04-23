import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaManagerComponent } from './area-manager.component';

describe('AreaManagerComponent', () => {
  let component: AreaManagerComponent;
  let fixture: ComponentFixture<AreaManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
