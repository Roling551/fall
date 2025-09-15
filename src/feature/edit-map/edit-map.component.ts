import { Component, computed } from '@angular/core';
import { CurrentLevelService } from '../../services/current-level.service';
import { Resource } from '../../models/resource';
import { UIStateService } from '../../services/ui-state/ui-state.service';

@Component({
  selector: 'app-edit-map',
  imports: [],
  templateUrl: './edit-map.component.html',
  styleUrl: './edit-map.component.scss'
})
export class EditMapComponent {
    constructor(private currentLevelService: CurrentLevelService, private uiStateService: UIStateService) {}

    map = computed(()=> {
        return this.currentLevelService.level.get()?.map
    })

    public changeResourcesAmount(resource: Resource, change: number) {
        this.uiStateService.setMapAction_.changeResource(resource, change)
    }
}
