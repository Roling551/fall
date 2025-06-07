import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { WorldMapComponent } from '../world-map/world-map.component';
import { WorldStateService } from '../../services/world-state.service';
import { Tile } from '../../models/tile';
import { MapEntity } from '../../models/map-entity';
import { City } from '../../models/city';
import { ActionsListComponent } from '../actions-list/actions-list.component';
import { UIStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-main-layout',
  imports: [WorldMapComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements AfterViewInit {

  @ViewChild('sideContainer', { read: ViewContainerRef }) sideContainer!: ViewContainerRef;

  constructor(public stateService: UIStateService) {}

  ngAfterViewInit(): void {
    this.stateService.setContainerRef(this.sideContainer)
    this.stateService.renderComponent(ActionsListComponent)
  }

  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.stateService.clearMapFunction();
  }
}
