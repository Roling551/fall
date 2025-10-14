import { Component, computed, Input } from '@angular/core';
import { CardDecisionOption, Decision, DecisionOption, ResourcesDecisionOption } from '../../models/decision';
import { CurrentWindowService } from '../../services/current-window.service';
import { DecisionsService } from '../../services/decisions.service';
import { CardComponent } from '../card/card.component';
import { resourcesToString } from '../../models/resource';

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

    decisionOptions(): DecisionOption[] {       
        return this.decision?.decisionOptions || []
    }

    onOptionChosen(option: DecisionOption) {
        option.choose()
        this.decisionsService.removeFirstDecision()
        this.decision = this.decisionsService.getFirstDecision()
    }

    getCardInfo(option: DecisionOption) {
        if(option.decisionOptionType == "Card") {
            const o = option as CardDecisionOption
            return o.cardToAdd
        }
        return undefined
    }

    getResourcesString(option: DecisionOption) {
        if(option.decisionOptionType == "Resources") {
            const o = option as ResourcesDecisionOption
            return resourcesToString(o.resources)
        }
        return undefined
    }
}
