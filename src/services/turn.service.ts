import { computed, Injectable, signal } from "@angular/core";
import { UIStateService } from "./ui-state/ui-state.service";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { CharactersCardsService } from "./character-cards/characters-cards.service";
import { TurnActorsService } from "./turn-actors.service";
import { CurrentLevelService } from "./current-level.service";
import { TurnBenefitsService } from "./turn-benefits.service";
import { CardOnHandRewardService } from "./card-on-hand-reward.service";

@Injectable({
  providedIn: 'root'
})
export class TurnService {
    constructor(
        private levelService: CurrentLevelService,
        private actionsCardsService: ActionsCardsService,
        private charactersCardsService: CharactersCardsService,
        private uiStateService: UIStateService,
        private turnActorsService: TurnActorsService,
        private turnBenefitsService: TurnBenefitsService,
        private cardOnHandRewardService: CardOnHandRewardService,
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
        this.turnBenefitsService.nextTurn()
        this.cardOnHandRewardService.nextTurn()
        this.turn.update(x=>x+1)
    }
}