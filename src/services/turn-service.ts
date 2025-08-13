import { computed, Injectable, signal } from "@angular/core";
import { WorldStateService } from "./world-state.service";
import { CardsService } from "./cards.service";
import { UIStateService } from "./ui-state/ui-state.service";

@Injectable({
  providedIn: 'root'
})
export class TurnService {
    constructor(private worldStateService: WorldStateService, private cardsService: CardsService, private uiStateService: UIStateService) {}

    turn = signal(0)

    public canNextTurn = computed(() => {
        return this.worldStateService.canNextTurn()
    })

    public nextTurn() {
        this.cardsService.nextTurn()
        this.worldStateService.nextTurn()
        this.uiStateService.setUIMode_.battle()
        this.turn.update(x=>x+1)
    }
}