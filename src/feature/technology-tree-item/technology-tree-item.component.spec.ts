import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyTreeItemComponent } from './technology-tree-item.component';

describe('TechnologyTreeItemComponent', () => {
  let component: TechnologyTreeItemComponent;
  let fixture: ComponentFixture<TechnologyTreeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologyTreeItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyTreeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
