import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologySelectionTreeItemComponent } from './technology-selection-tree-item.component';

describe('TechnologySelectionTreeItemComponent', () => {
  let component: TechnologySelectionTreeItemComponent;
  let fixture: ComponentFixture<TechnologySelectionTreeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnologySelectionTreeItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologySelectionTreeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
