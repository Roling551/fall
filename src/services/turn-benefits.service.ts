import { Injectable } from "@angular/core";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { SkillMapActionSkillBonus } from "../models/bonus";
import { createForceSignal } from "../util/force-signal";

@Injectable({
  providedIn: 'root'
})
export class TurnBenefitsService {
    constructor(
        private actionsCardsService: ActionsCardsService,
    ) {}

    skillMapActionSkillBonuses = createForceSignal(new Map<string, SkillMapActionSkillBonus>())

    nextTurn() {
        const skillMapActionSkillBonuses = new Map<string, SkillMapActionSkillBonus>();
        if(this.actionsCardsService.cardsHand)
        for(const card of this.actionsCardsService.cardsHand!.hand.get()) {
            const bonus = card.cardOnHandBenefits.get("skill-map-action-skill-bonus")
            if(bonus) {
                skillMapActionSkillBonuses.set(bonus.name, bonus)
            }
        }
        this.skillMapActionSkillBonuses.set(skillMapActionSkillBonuses)
    }
}