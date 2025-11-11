import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstateDescriptionComponent } from './estate-description.component';

describe('EstateDescriptionComponent', () => {
  let component: EstateDescriptionComponent;
  let fixture: ComponentFixture<EstateDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstateDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstateDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
