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
  imports: [WorldMapComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements AfterViewInit {

  @ViewChild('sideContainer', { read: ViewContainerRef }) sideContainer!: ViewContainerRef;
  @ViewChild('headerContainer', { read: ViewContainerRef }) headerContainer!: ViewContainerRef;

  constructor(public uiStateService: UIStateService) {}

  ngAfterViewInit(): void {
    this.uiStateService.setSideContainerRef(this.sideContainer)
    this.uiStateService.setHeaderContainerRef(this.headerContainer)
    this.uiStateService.setUIMode_.main()
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.uiStateService.cancelButtonAction()();
  }
}
