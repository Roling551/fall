import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardContentActionComponent } from './card-content-action.component';

describe('CardContentActionComponent', () => {
  let component: CardContentActionComponent;
  let fixture: ComponentFixture<CardContentActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardContentActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardContentActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
