import { AfterViewInit, Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import panzoom from 'panzoom';
import { TreeComponent } from '../../shared/tree/tree.component';
import { CurrentWindowService } from '../../services/current-window.service';

@Component({
  selector: 'app-tech-tree',
  imports: [NgxGraphModule, TreeComponent],
  templateUrl: './tech-tree.component.html',
  styleUrl: './tech-tree.component.scss'
})
export class TechTreeComponent {

  constructor(public currentWindowService: CurrentWindowService) {}
  
  ngAfterViewInit() {
    const element = document.getElementById('tree');
    const instance = panzoom(element!, {zoomDoubleClickSpeed: 1});
  }
  
  onGoBackClick(): void {
    this.currentWindowService.currentWindow.set("world-map")
  }
}
