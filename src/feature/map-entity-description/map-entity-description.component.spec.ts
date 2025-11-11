import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapEntityDescriptionComponent } from './map-entity-description.component';

describe('MapEntityDescriptionComponent', () => {
  let component: MapEntityDescriptionComponent;
  let fixture: ComponentFixture<MapEntityDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapEntityDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapEntityDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
