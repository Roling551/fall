import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtractionInfoComponent } from './extraction-info.component';

describe('ExtractionInfoComponent', () => {
  let component: ExtractionInfoComponent;
  let fixture: ComponentFixture<ExtractionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtractionInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtractionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
