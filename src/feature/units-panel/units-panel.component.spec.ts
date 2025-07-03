import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsPanelComponent } from './units-panel.component';

describe('UnitsPanelComponent', () => {
  let component: UnitsPanelComponent;
  let fixture: ComponentFixture<UnitsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
