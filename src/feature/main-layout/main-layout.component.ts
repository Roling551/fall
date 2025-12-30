import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { WorldMapComponent } from '../world-map/world-map.component';
import { Tile } from '../../models/tile/tile';
import { MapEntity } from '../../models/map-entity';
import { ActionsListComponent } from '../actions-list/actions-list.component';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { GameInfoPanelComponent } from '../game-info-panel/game-info-panel.component';
import { CardsComponent } from '../cards/cards.component';
import { ActionsCardsService } from '../../services/action-cards/actions-cards.service';
import { CharactersCardsService } from '../../services/character-cards/characters-cards.service';
import { CardsListComponent } from '../cards-list/cards-list.component';

@Component({
  selector: 'app-main-layout',
  imports: [WorldMapComponent, CardsComponent, GameInfoPanelComponent, CardsListComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements AfterViewInit {

    @ViewChild('sideContainer', { read: ViewContainerRef }) sideContainer!: ViewContainerRef;

    actionsCards
    charactersCards

    constructor(
        private uiStateService: UIStateService,
        private actionsCardsService: ActionsCardsService,
        private charactersCardsService: CharactersCardsService
    ) {
        this.actionsCards = this.actionsCardsService.cardsHand
        this.charactersCards = this.charactersCardsService.cardsHand
    }

    ngAfterViewInit(): void {
        this.uiStateService.setSideContainerRef(this.sideContainer)
    }

    onRightClick(event: MouseEvent) {
        event.preventDefault();
        this.uiStateService.cancel();
        this.charactersCardsService.onRightClick()
    }
}
