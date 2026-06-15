import { Component, computed, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { LevelsService } from '../../services/levels.service';
import { CurrentWindowService } from '../../services/current-window.service';
import { getProvisionPickAllocation, ProvisionPick, provisionPickToValues, ProvisionService } from '../../services/provision.service';
import { zeroValuesFunctional } from '../../util/map-functions';
import { Resource } from '../../models/resource';
import { GroupedCardsListComponent } from '../grouped-cards-list/grouped-cards-list.component';
import { ActionsCardsService } from '../../services/action-cards/actions-cards.service';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { createSelectAnyActionCards } from '../../services/ui-state/create-player-action';
import { createForceSignal } from '../../util/force-signal';
import { CardInfo } from '../../models/card-info';

@Component({
  selector: 'app-pick-provision',
  imports: [GroupedCardsListComponent],
  templateUrl: './pick-provision.component.html',
  styleUrl: './pick-provision.component.scss'
})
export class PickProvisionComponent {
    constructor(
        private levelsService: LevelsService, 
        private currentWindowService: CurrentWindowService, 
        private provisionService: ProvisionService,
        private actionsCardsService: ActionsCardsService,
        private uiStateService: UIStateService,
    ) {
        const selectedCards = createForceSignal(new Map<number, CardInfo>())
        this.provisionService.changeIntoProvision()
        this.provisionPick = signal<ProvisionPick>({
            resources: zeroValuesFunctional(this.provisionService.currentProvision()!.resources),
            cards: selectedCards
        })
        createSelectAnyActionCards(
            uiStateService, 
            (card)=>this.getAllocation() < this.getProvisionCapacity(),
            selectedCards
        )
    }
    
    provisionPick: WritableSignal<ProvisionPick>

    provisionValue = computed(()=>{
        return provisionPickToValues(this.provisionPick(), this.provisionService.currentProvision()!, this.provisionService.currentPickProvisionSettings())
    })

    getAllocation = computed(()=>{
        return getProvisionPickAllocation(this.provisionPick())
    })

    actionsCards = computed(()=>{
        return this.actionsCardsService.cardsSet!
    })

    onFinalizingPicking(): void {
        this.uiStateService.cancel()
        this.provisionService.useProvision(this.provisionPick())
        this.levelsService.nextLevel()
        this.currentWindowService.currentWindow.set("world-map")
    }

    getAvaliableResources = computed(()=>{
        return this.provisionService.currentProvision()!.resources
    })

    getProvisionCapacity = computed(()=>{
        return this.provisionService.currentPickProvisionSettings().capacity
    })

    changeResourcesPick(change: number, resource: Resource) {
        let currentPick = this.provisionPick().resources.get(resource)!
        if(this.getAllocation()+change > this.getProvisionCapacity() || (this.getAllocation()+change < 0)) {
            return
        }
        if(currentPick + change > this.provisionService.maxProvisonPick().resources.get(resource)! || (currentPick + change < 0)) {
            return
        }
        this.provisionPick().resources.set(resource, currentPick+change)
        this.provisionPick.set({...this.provisionPick()})
    }
}
