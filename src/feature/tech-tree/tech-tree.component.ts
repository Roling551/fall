import { AfterViewInit, Component } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import panzoom from 'panzoom';
import { TreeComponent } from '../../shared/tree/tree.component';

@Component({
  selector: 'app-tech-tree',
  imports: [NgxGraphModule, TreeComponent],
  templateUrl: './tech-tree.component.html',
  styleUrl: './tech-tree.component.scss'
})
export class TechTreeComponent implements AfterViewInit {
  ngAfterViewInit(): void {
  }
}
