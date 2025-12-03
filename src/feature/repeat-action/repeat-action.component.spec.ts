import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatActionComponent } from './repeat-action.component';

describe('RepeatActionComponent', () => {
  let component: RepeatActionComponent;
  let fixture: ComponentFixture<RepeatActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepeatActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
