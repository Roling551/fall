import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickProvisionComponent } from './pick-provision.component';

describe('PickProvisionComponent', () => {
  let component: PickProvisionComponent;
  let fixture: ComponentFixture<PickProvisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickProvisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickProvisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
