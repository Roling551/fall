import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardContentCharacterComponent } from './card-content-character.component';

describe('CardContentCharacterComponent', () => {
  let component: CardContentCharacterComponent;
  let fixture: ComponentFixture<CardContentCharacterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardContentCharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardContentCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
