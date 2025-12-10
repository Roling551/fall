import { computed, Injectable, signal } from "@angular/core";
import { UIStateService } from "./ui-state/ui-state.service";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { CharactersCardsService } from "./character-cards/characters-cards.service";
import { TurnActorsService } from "./turn-actors.service";
import { CurrentLevelService } from "./current-level.service";
import { TurnBenefitsService } from "./turn-benefits.service";
import { CardOnHandRewardService } from "./card-on-hand-reward.service";
import { ResourcesService } from "./resources.service";

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
        private resourcesService: ResourcesService,
    ) {}

    turn = signal(0)

    public canNextTurn = computed(() => {
        const level = this.levelService.level.get()
        if(!level) {
            return false
        }
        const sufficientResources = this.resourcesService.canAffordResources(this.turnActorsService.requiredResources())
        return level.canNextTurn() && sufficientResources
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