import { Component, computed, Input } from '@angular/core';
import { CurrentWindowService } from '../../services/current-window.service';
import { DecisionsService } from '../../services/decisions.service';
import { CardComponent } from '../card/card.component';
import { resourcesToString } from '../../models/resource';
import { CardReward, ResourcesReward, Reward } from '../../models/reward';
import { Decision } from '../../models/decision';

@Component({
  selector: 'app-decision-panel',
  imports: [CardComponent],
  templateUrl: './decision-panel.component.html',
  styleUrl: './decision-panel.component.scss'
})
export class DecisionPanelComponent {
    decision?: Decision

    constructor(public currentWindowService: CurrentWindowService, public decisionsService: DecisionsService) {
        this.decision = decisionsService.getFirstDecision()
    }

    onGoBackClick(): void {
        this.currentWindowService.currentWindow.set("world-map")
    }

    decisionOptions(): Reward[] {       
        return this.decision?.decisionOptions || []
    }

    onOptionChosen(reward: Reward) {
        reward.claim()
        this.decisionsService.removeFirstDecision()
        this.decision = this.decisionsService.getFirstDecision()
    }

    getCardInfo(reward: Reward) {
        if(reward.rewardType == "Card") {
            const r = reward as CardReward
            return r.cardToAdd
        }
        return undefined
    }

    getResourcesString(reward: Reward) {
        if(reward.rewardType == "Resources") {
            const r = reward as ResourcesReward
            return resourcesToString(r.resources)
        }
        return undefined
    }
}
