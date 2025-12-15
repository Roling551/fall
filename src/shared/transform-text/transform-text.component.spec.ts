import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformTextComponent } from './transform-text.component';

describe('TransformTextComponent', () => {
  let component: TransformTextComponent;
  let fixture: ComponentFixture<TransformTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransformTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
