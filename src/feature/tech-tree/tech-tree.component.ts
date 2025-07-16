import { AfterViewInit, Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import panzoom from 'panzoom';
import { TreeComponent } from '../../shared/tree/tree.component';
import { CurrentWindowService } from '../../services/current-window.service';
import { TechnologiesService } from '../../services/technologies/technologies.service';
import { Cell } from '../../models/cell';
import { Technology } from '../../models/technology';

@Component({
  selector: 'app-tech-tree',
  imports: [NgxGraphModule, TreeComponent],
  templateUrl: './tech-tree.component.html',
  styleUrl: './tech-tree.component.scss'
})
export class TechTreeComponent {

  technologies

  constructor(public currentWindowService: CurrentWindowService, public technologiesService: TechnologiesService) {
    this.technologies = technologiesService.technologies
  }
  
  ngAfterViewInit() {
    const element = document.getElementById('tree');
    const instance = panzoom(element!, {zoomDoubleClickSpeed: 1});
  }
  
  onGoBackClick(): void {
    this.currentWindowService.currentWindow.set("world-map")
  }

  onDiscoverClick(cell: Cell<Technology>) {
    this.technologiesService.discover(cell);
  }

  getCellColor(cell: Cell<Technology>) {
    if(cell.value.discovered())
      return 'LightGreen'
    else if(!cell.value.avaliable()) {
      return 'Grey'
    } else {
      return 'White'
    }
  }
}
