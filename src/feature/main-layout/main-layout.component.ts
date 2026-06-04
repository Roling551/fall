import { AfterViewInit, Component, computed, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { WorldMapComponent } from '../world-map/world-map.component';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { GameInfoPanelComponent } from '../game-info-panel/game-info-panel.component';
import { ActionsCardsService } from '../../services/action-cards/actions-cards.service';
import { GroupedCardsListComponent } from '../grouped-cards-list/grouped-cards-list.component';
import { HoverInfoService } from '../../services/hover-info.service';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';

@Component({
  selector: 'app-main-layout',
  imports: [WorldMapComponent, GameInfoPanelComponent, GroupedCardsListComponent, TransformTextComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements AfterViewInit {

    @ViewChild('sideContainer', { read: ViewContainerRef }) sideContainer!: ViewContainerRef;

    actionsCards

    constructor(
        private uiStateService: UIStateService,
        private actionsCardsService: ActionsCardsService,
        private hoverInfoService: HoverInfoService,
    ) {
        this.actionsCards = this.actionsCardsService.cardsHand
    }

    ngAfterViewInit(): void {
        this.uiStateService.setSideContainerRef(this.sideContainer)
    }

    onRightClick(event: MouseEvent) {
        event.preventDefault();
        this.uiStateService.cancel();
    }

    getHover = computed(()=>{
        const hover = this.hoverInfoService.currentHover()
        if(!hover) {
            return undefined
        }
        const rect = hover.element.getBoundingClientRect();
        const isLeft = rect.left > window.innerWidth/2
        const isTop = rect.top > window.innerHeight/2
        const x = (isLeft ? rect.left: rect.right) + window.scrollX;
        const y = (isTop ? rect.top: rect.bottom) + window.scrollY;
        return {
            textParts: hover.textParts,
            isLeft,
            isTop,
            x,
            y,
        }
    })

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        this.hoverInfoService.mouseEvent(event)
    }
}
