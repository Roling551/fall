import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesInfoComponent } from './resources-info.component';

describe('ResourcesInfoComponent', () => {
  let component: ResourcesInfoComponent;
  let fixture: ComponentFixture<ResourcesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
