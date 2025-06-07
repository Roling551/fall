import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMarkingComponent } from './map-marking.component';

describe('MapMarkingComponent', () => {
  let component: MapMarkingComponent;
  let fixture: ComponentFixture<MapMarkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapMarkingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapMarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
