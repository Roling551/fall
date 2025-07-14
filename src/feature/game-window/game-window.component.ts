import { Component, OnInit } from '@angular/core';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { CurrentWindowService } from '../../services/current-window.service';
import { TechTreeComponent } from '../tech-tree/tech-tree.component';
import { InitService } from '../../services/init.service';

@Component({
  selector: 'app-game-window',
  imports: [MainLayoutComponent, TechTreeComponent],
  templateUrl: './game-window.component.html',
  styleUrl: './game-window.component.scss'
})
export class GameWindowComponent implements OnInit {
  currentWindow;
  constructor(public currentWindowService:CurrentWindowService, public initService: InitService) {
    this.currentWindow = currentWindowService.currentWindow
  }
  ngOnInit(): void {
    this.initService.init()
  }
}
