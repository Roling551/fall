import { Component, Input, input } from '@angular/core';
import { Cell } from '../../models/cell';
import { getTechnologyTreeItem, TechnologyTreeItem } from '../../models/technology-tree-item';
import { Technology } from '../../models/technology';
import { TechnologySelection } from '../../models/technology-selection';

@Component({
  selector: 'app-technology-selection-tree-item',
  imports: [],
  templateUrl: './technology-selection-tree-item.component.html',
  styleUrl: './technology-selection-tree-item.component.scss'
})
export class TechnologySelectionTreeItemComponent {
  cell = input.required<Cell<TechnologyTreeItem>>()
  technologies = input.required<TechnologySelection>()

  @Input({required: true}) sizeX!: number;
  @Input({required: true}) spaceX!: number;

  public getTransformX(column:number) {
    return (this.sizeX + this.spaceX) * column
  }

  onTechnologySelect(technology: Technology) {
    const treeItem = getTechnologyTreeItem(technology)
    if(!treeItem) {
      return
    }
    for(const childCell of this.cell().children) {
      childCell.value.makeAvaliable()
    }
    technology.discovered.set(true)
    this.cell().replace(treeItem, 1)
  }

  getCellColor() {
    if(!this.cell().value.avaliable()) {
      return 'Grey'
    } else {
      return 'White'
    }
  }
}
