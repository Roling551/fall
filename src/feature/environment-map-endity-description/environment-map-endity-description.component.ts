import { Component, computed, Input } from '@angular/core';
import { EnvironmentMapEntity } from '../../models/environment-map-entity';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';

@Component({
  selector: 'app-environment-map-endity-description',
  imports: [TransformTextComponent],
  templateUrl: './environment-map-endity-description.component.html',
  styleUrl: './environment-map-endity-description.component.scss'
})
export class EnvironmentMapEndityDescriptionComponent {
    @Input({required:true}) environmentMapEntity!: EnvironmentMapEntity

    getDescription = computed(()=> {
        return this.environmentMapEntity.getDescription()
    })
}
