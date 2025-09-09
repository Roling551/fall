import { computed, Injectable, signal } from "@angular/core";
import { UIStateService } from "./ui-state/ui-state.service";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { CharactersCardsService } from "./characters-cards.service";
import { TurnActorsService } from "./turn-actors.service";
import { LevelService } from "./level.service";

@Injectable({
  providedIn: 'root'
})
export class TurnService {
    constructor(
        private levelService: LevelService,
        private actionsCardsService: ActionsCardsService,
        private charactersCardsService: CharactersCardsService,
        private uiStateService: UIStateService,
        private turnActorsService: TurnActorsService,
    ) {}

    turn = signal(0)

    public canNextTurn = computed(() => {
        const level = this.levelService.level.get()
        if(!level) {
            return false
        }
        return level.canNextTurn()
    })

    public nextTurn() {
        const level = this.levelService.level.get()
        if(!level) {
            return
        }
        this.actionsCardsService.nextTurn()
        this.charactersCardsService.nextTurn()
        level.nextTurn()
        this.turnActorsService.nextTurn()
        this.turn.update(x=>x+1)
    }
}