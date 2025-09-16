import { Component } from '@angular/core';
import { MapEntity } from '../../models/map-entity';
import { City } from '../../models/city';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { SimpleTextComponent } from '../../shared/simple-text/simple-text.component';
import { MapMarkingComponent } from '../../shared/map-marking/map-marking.component';
import { ForceSignal } from '../../util/force-signal';
import { CurrentWindowService } from '../../services/current-window.service';
import { LevelsService } from '../../services/levels.service';

@Component({
  selector: 'app-actions-list',
  imports: [],
  templateUrl: './actions-list.component.html',
  styleUrl: './actions-list.component.scss'
})
export class ActionsListComponent {
  constructor(
    private uiStateService: UIStateService,
    private currentWindowService:CurrentWindowService,
    private levelsService: LevelsService,
  ) {}

  onCreateCityClick(): void {
    this.uiStateService.setUI_.createCity()
  }
  onRemoveCityClick(): void {
    this.uiStateService.setUI_.removeCity()
  }
  onTechTreeClick(): void {
    this.currentWindowService.currentWindow.set("tech-tree")
  }
  onNextLevel(): void {
    this.levelsService.nextLevel()
  }
  onEditMapClick(): void{
    this.uiStateService.setUI_.changeResource()
  }
}
