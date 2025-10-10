import { Component, Input } from '@angular/core';
import { Decision, DecisionOption } from '../../models/decision';
import { CurrentWindowService } from '../../services/current-window.service';
import { DecisionsService } from '../../services/decisions.service';

@Component({
  selector: 'app-decision-panel',
  imports: [],
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
}
