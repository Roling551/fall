import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptActionComponent } from './accept-action.component';

describe('AcceptActionComponent', () => {
  let component: AcceptActionComponent;
  let fixture: ComponentFixture<AcceptActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
