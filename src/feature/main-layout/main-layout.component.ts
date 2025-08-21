import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { WorldMapComponent } from '../world-map/world-map.component';
import { WorldStateService } from '../../services/world-state/world-state.service';
import { Tile } from '../../models/tile';
import { MapEntity } from '../../models/map-entity';
import { City } from '../../models/city';
import { ActionsListComponent } from '../actions-list/actions-list.component';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { GameInfoPanelComponent } from '../game-info-panel/game-info-panel.component';
import { CardsComponent } from '../cards/cards.component';
import { ActionsCardsService } from '../../services/actions-cards.service';
import { CharactersCardsService } from '../../services/characters-cards.service';

@Component({
  selector: 'app-main-layout',
  imports: [WorldMapComponent, CardsComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements AfterViewInit {

    @ViewChild('sideContainer', { read: ViewContainerRef }) sideContainer!: ViewContainerRef;
    @ViewChild('headerContainer', { read: ViewContainerRef }) headerContainer!: ViewContainerRef;

    actionsCards
    charactersCards

    constructor(
        public uiStateService: UIStateService,
        public actionsCardsService: ActionsCardsService,
        public charactersCardsService: CharactersCardsService
    ) {
        this.actionsCards = this.actionsCardsService.cardsHand
        this.charactersCards = this.charactersCardsService.cardsHand
    }

    ngAfterViewInit(): void {
        this.uiStateService.setSideContainerRef(this.sideContainer)
        this.uiStateService.setHeaderContainerRef(this.headerContainer)
        this.uiStateService.setUIMode_.main({setup:true})
    }

    onRightClick(event: MouseEvent) {
        event.preventDefault();
        this.uiStateService.cancel();
    }


}
