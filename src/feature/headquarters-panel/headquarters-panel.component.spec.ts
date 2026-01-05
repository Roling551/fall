import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquartersPanelComponent } from './headquarters-panel.component';

describe('HeadquartersPanelComponent', () => {
  let component: HeadquartersPanelComponent;
  let fixture: ComponentFixture<HeadquartersPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadquartersPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadquartersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
