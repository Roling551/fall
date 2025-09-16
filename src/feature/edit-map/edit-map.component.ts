import { Component, computed, signal } from '@angular/core';
import { CurrentLevelService } from '../../services/current-level.service';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { Skill } from '../../models/skill';
import { EditMapParameters } from '../../models/resources-sources';
import { Resource } from '../../models/resource';

@Component({
  selector: 'app-edit-map',
  imports: [],
  templateUrl: './edit-map.component.html',
  styleUrl: './edit-map.component.scss'
})
export class EditMapComponent {
    parameters:EditMapParameters

    constructor(private currentLevelService: CurrentLevelService, private uiStateService: UIStateService) {
        this.parameters = this.uiStateService.additionalInfo()["editMapParameters"]
    }

    map = computed(()=> {
        return this.currentLevelService.level.get()?.map
    })

    skills: Skill[] = ['mining', 'construction', 'science', 'survival', 'cutting'];
    resources: Resource[] = ['water', 'oil', 'scrap'];

    setAmount(event: Event) {
        const value = +(event.target as HTMLInputElement).value;
        this.parameters.amount.set(value)
    }

    setDifficulty(event: Event) {
        const value = +(event.target as HTMLInputElement).value;
        this.parameters.difficulty.set(value)
    }

    setSkill(event: Event) {
        const value = (event.target as HTMLSelectElement).value as Skill;
        this.parameters.skill.set(value);
    }

    setResource(event: Event) {
        const value = (event.target as HTMLSelectElement).value as Resource;
        this.parameters.resource.set(value);
    }
}
