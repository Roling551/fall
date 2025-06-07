import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityPanelComponent } from './city-panel.component';

describe('CityPanelComponent', () => {
  let component: CityPanelComponent;
  let fixture: ComponentFixture<CityPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CityPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
