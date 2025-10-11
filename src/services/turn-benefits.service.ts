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
            const bonuses = card.cardOnHandBenefits?.filter(x=>x.type==="skill-map-action-skill-bonus").map(x=>x.benefit) || []
            for(const bonus of bonuses) {
                skillMapActionSkillBonuses.set(bonus.name, bonus)
            }
        }
        this.skillMapActionSkillBonuses.set(skillMapActionSkillBonuses)
    }
}