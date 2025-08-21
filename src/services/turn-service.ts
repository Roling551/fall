import { computed, Injectable, signal } from "@angular/core";
import { WorldStateService } from "./world-state/world-state.service";
import { UIStateService } from "./ui-state/ui-state.service";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { CharactersCardsService } from "./characters-cards.service";

@Injectable({
  providedIn: 'root'
})
export class TurnService {
    constructor(
        private worldStateService: WorldStateService,
        private actionsCardsService: ActionsCardsService,
        private charactersCardsService: CharactersCardsService,
        private uiStateService: UIStateService
    ) {}

    turn = signal(0)

    public canNextTurn = computed(() => {
        return this.worldStateService.canNextTurn()
    })

    public nextTurn() {
        this.actionsCardsService.nextTurn()
        this.charactersCardsService.nextTurn()
        this.worldStateService.nextTurn()
        this.uiStateService.setUIMode_.battle()
        this.turn.update(x=>x+1)
    }
}