import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTimeJobPanelComponent } from './one-time-job-panel.component';

describe('OneTimeJobPanelComponent', () => {
  let component: OneTimeJobPanelComponent;
  let fixture: ComponentFixture<OneTimeJobPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneTimeJobPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneTimeJobPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
