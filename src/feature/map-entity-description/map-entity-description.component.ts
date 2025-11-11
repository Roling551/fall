import { Component, Input } from '@angular/core';
import { MapEntity } from '../../models/map-entity';
import { Estate } from '../../models/estate';
import { EnvironmentMapEntity } from '../../models/environment-map-entity';
import { EstateDescriptionComponent } from '../estate-description/estate-description.component';
import { EnvironmentMapEndityDescriptionComponent } from '../environment-map-endity-description/environment-map-endity-description.component';

@Component({
  selector: 'app-map-entity-description',
  imports: [EstateDescriptionComponent, EnvironmentMapEndityDescriptionComponent],
  templateUrl: './map-entity-description.component.html',
  styleUrl: './map-entity-description.component.scss'
})
export class MapEntityDescriptionComponent {
    @Input({required:true}) mapEntity!: MapEntity

    getEstate() {
        if(this.mapEntity.type === "estate" || this.mapEntity.type === "upgrade") {
            return this.mapEntity as Estate
        }
        return undefined
    }

    getEnvironmentMapEntity() {
        if(this.mapEntity.type === "environment") {
            return this.mapEntity as EnvironmentMapEntity
        }
        return undefined
    }
}
