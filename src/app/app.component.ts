import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameWindowComponent } from '../feature/game-window/game-window.component';

@Component({
  selector: 'app-root',
  imports: [GameWindowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fall';
}
