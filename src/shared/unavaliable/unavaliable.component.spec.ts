import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavaliableComponent } from './unavaliable.component';

describe('UnavaliableComponent', () => {
  let component: UnavaliableComponent;
  let fixture: ComponentFixture<UnavaliableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnavaliableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnavaliableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
