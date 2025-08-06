import { Component, input } from '@angular/core';
import { TechnologyTreeItem } from '../../models/technology-tree-item';
import { Cell } from '../../models/cell';
import { Technology } from '../../models/technology';
import { TechnologiesService } from '../../services/technologies/technologies.service';

@Component({
  selector: 'app-technology-tree-item',
  imports: [],
  templateUrl: './technology-tree-item.component.html',
  styleUrl: './technology-tree-item.component.scss'
})
export class TechnologyTreeItemComponent {
  cell = input.required<Cell<TechnologyTreeItem>>()
  technology = input.required<Technology>()

  constructor(private technologiesService: TechnologiesService) {}
  
  onDiscoverClick() {
    this.technology().discovered.set(true)
    for(const childCell of this.cell().children) {
        childCell.value.makeAvaliable()
    }
    this.technologiesService.discover(this.technology())
  }

  getCellColor() {
    if(this.technology().discovered())
      return 'LightGreen'
    else if(!this.cell().value.avaliable()) {
      return 'Grey'
    } else {
      return 'White'
    }
  }
}
