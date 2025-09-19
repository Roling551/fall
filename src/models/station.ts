import { MapEntity, MapEntityType } from "./map-entity";

export class Station extends MapEntity {
    override type: MapEntityType = "base"
    
    constructor() {
        super("city", 0)
    }
} 