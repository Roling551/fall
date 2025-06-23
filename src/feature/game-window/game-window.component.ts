import { Component } from '@angular/core';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { CurrentWindowService } from '../../services/current-window.service';
import { TechTreeComponent } from '../tech-tree/tech-tree.component';

@Component({
  selector: 'app-game-window',
  imports: [MainLayoutComponent, TechTreeComponent],
  templateUrl: './game-window.component.html',
  styleUrl: './game-window.component.scss'
})
export class GameWindowComponent {
  currentWindow;
  constructor(public currentWindowService:CurrentWindowService) {
    this.currentWindow = currentWindowService.currentWindow
  }
}
