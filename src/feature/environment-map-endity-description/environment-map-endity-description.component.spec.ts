import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentMapEndityDescriptionComponent } from './environment-map-endity-description.component';

describe('EnvironmentMapEndityDescriptionComponent', () => {
  let component: EnvironmentMapEndityDescriptionComponent;
  let fixture: ComponentFixture<EnvironmentMapEndityDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentMapEndityDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentMapEndityDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
