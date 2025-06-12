import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { WorldMapComponent } from '../world-map/world-map.component';
import { WorldStateService } from '../../services/world-state.service';
import { Tile } from '../../models/tile';
import { MapEntity } from '../../models/map-entity';
import { City } from '../../models/city';
import { ActionsListComponent } from '../actions-list/actions-list.component';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { GameInfoPanelComponent } from '../game-info-panel/game-info-panel.component';

@Component({
  selector: 'app-main-layout',
  imports: [WorldMapComponent, GameInfoPanelComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements AfterViewInit {

  @ViewChild('sideContainer', { read: ViewContainerRef }) sideContainer!: ViewContainerRef;

  constructor(public uiStateService: UIStateService) {}

  ngAfterViewInit(): void {
    this.uiStateService.setContainerRef(this.sideContainer)
    this.uiStateService.setUI({component:ActionsListComponent})
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.uiStateService.cancelButtonAction()();
  }
}
