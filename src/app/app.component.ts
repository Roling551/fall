import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameWindowComponent } from '../feature/game-window/game-window.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [GameWindowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    constructor(private translate: TranslateService) {
        translate.use('pl');
    }
    title = 'fall';
}
