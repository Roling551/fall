import { Component } from '@angular/core';
import { MapEntity } from '../../models/map-entity';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { SimpleTextComponent } from '../../shared/simple-text/simple-text.component';
import { MapMarkingComponent } from '../../shared/map-marking/map-marking.component';
import { ForceSignal } from '../../util/force-signal';
import { CurrentWindowService } from '../../services/current-window.service';
import { LevelsService } from '../../services/levels.service';
import { CurrentLevelService } from '../../services/current-level.service';

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
    private currentLevelService: CurrentLevelService,
  ) {}

  onCreateStationClick(): void {
    this.uiStateService.setUI_.createStation()
  }
  onTechTreeClick(): void {
    this.currentWindowService.currentWindow.set("tech-tree")
  }
  onNextLevel(): void {
    this.levelsService.nextLevel()
  }
  canNextLevel(): boolean {
    return this.levelsService.canNextLevel()
  }


  onEditMapClick(): void {
    this.uiStateService.setUI_.changeResource()
  }
  onSaveClick(): void {
    this.currentLevelService.save()
  }
  onLoadClick(): void {
    this.currentLevelService.load()
  }
}
