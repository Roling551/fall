import { Component } from '@angular/core';
import { HeadquartersService } from '../../services/headquarters.service';
import { resourcesToTextParts } from '../../models/resource';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';

@Component({
  selector: 'app-headquarters-panel',
  imports: [TransformTextComponent],
  templateUrl: './headquarters-panel.component.html',
  styleUrl: './headquarters-panel.component.scss'
})
export class HeadquartersPanelComponent {
    constructor(private headquartersService: HeadquartersService) {}

    requiredResourcesText() {
        return ["Upkeep: ", ...resourcesToTextParts(this.headquartersService.headquarters.getRequiredResources())]
    }
}
