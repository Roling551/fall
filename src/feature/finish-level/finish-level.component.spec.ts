import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishLevelComponent } from './finish-level.component';

describe('FinishLevelComponent', () => {
  let component: FinishLevelComponent;
  let fixture: ComponentFixture<FinishLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishLevelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
