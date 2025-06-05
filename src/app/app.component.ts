import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorldMapComponent } from '../feature/world-map/world-map.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WorldMapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fall';
}
