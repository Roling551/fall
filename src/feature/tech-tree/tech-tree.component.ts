import { AfterViewInit, Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import panzoom from 'panzoom';
import { TreeComponent } from '../../shared/tree/tree.component';
import { CurrentWindowService } from '../../services/current-window.service';
import { TechnologiesService } from '../../services/technologies/technologies.service';
import { Cell } from '../../models/cell';
import { Technology } from '../../models/technology';
import { TechnologyTreeItem } from '../../models/technology-tree-item';
import { TechnologyTreeItemComponent } from '../technology-tree-item/technology-tree-item.component';
import { TechnologySelectionTreeItemComponent } from '../technology-selection-tree-item/technology-selection-tree-item.component';

@Component({
  selector: 'app-tech-tree',
  imports: [NgxGraphModule, TreeComponent, TechnologyTreeItemComponent, TechnologySelectionTreeItemComponent],
  templateUrl: './tech-tree.component.html',
  styleUrl: './tech-tree.component.scss'
})
export class TechTreeComponent {

  technologies

  public readonly sizeX=200
  public readonly sizeY=100
  public readonly spaceX=20
  public readonly spaceY=40

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
}
