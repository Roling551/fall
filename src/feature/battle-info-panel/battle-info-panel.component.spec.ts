import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleInfoPanelComponent } from './battle-info-panel.component';

describe('BattleInfoPanelComponent', () => {
  let component: BattleInfoPanelComponent;
  let fixture: ComponentFixture<BattleInfoPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BattleInfoPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BattleInfoPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
