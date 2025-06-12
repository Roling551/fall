import { Component, Input } from '@angular/core';
import { City } from '../../models/city';

@Component({
  selector: 'app-city-panel',
  imports: [],
  templateUrl: './city-panel.component.html',
  styleUrl: './city-panel.component.scss'
})
export class CityPanelComponent {
  @Input({required: true}) city!: City;
  public ownedTilesNumber() {
    return this.city.ownedTiles.get().size
  }
}
