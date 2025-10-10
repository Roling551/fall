import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionPanelComponent } from './decision-panel.component';

describe('DecisionPanelComponent', () => {
  let component: DecisionPanelComponent;
  let fixture: ComponentFixture<DecisionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
