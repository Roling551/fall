import { Component, computed, Input } from '@angular/core';
import { EnvironmentMapEntity } from '../../models/environment-map-entity';

@Component({
  selector: 'app-environment-map-endity-description',
  imports: [],
  templateUrl: './environment-map-endity-description.component.html',
  styleUrl: './environment-map-endity-description.component.scss'
})
export class EnvironmentMapEndityDescriptionComponent {
    @Input({required:true}) environmentMapEntity!: EnvironmentMapEntity

    getDescription = computed(()=> {
        return this.environmentMapEntity.getDescription()
    })
}
