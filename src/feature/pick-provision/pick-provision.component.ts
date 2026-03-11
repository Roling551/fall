import { Component, computed, OnInit, signal } from '@angular/core';
import { LevelsService } from '../../services/levels.service';
import { CurrentWindowService } from '../../services/current-window.service';
import { getProvisionPickAllocation, ProvisionPick, provisionPickToValues, ProvisionService } from '../../services/provision.service';
import { zeroValuesFunctional } from '../../util/map-functions';
import { Resource } from '../../models/resource';

@Component({
  selector: 'app-pick-provision',
  imports: [],
  templateUrl: './pick-provision.component.html',
  styleUrl: './pick-provision.component.scss'
})
export class PickProvisionComponent {
    constructor(private levelsService: LevelsService, private currentWindowService: CurrentWindowService, private provisionService: ProvisionService) {
        this.provisionService.changeIntoProvision()
        this.provisionPick = signal<ProvisionPick>({
            resources: zeroValuesFunctional(this.provisionService.currentProvision()!.resources)
        })
    }
    
    provisionPick

    provisionValue = computed(()=>{
        return provisionPickToValues(this.provisionPick(), this.provisionService.currentProvision()!, this.provisionService.currentPickProvisionSettings())
    })

    getAllocation = computed(()=>{
        return getProvisionPickAllocation(this.provisionPick())
    })

    onFinalizingPicking(): void {
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
