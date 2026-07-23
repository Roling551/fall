import { Extraction } from "./extraction";
import { MapEntity, MapEntityType } from "./map-entity";

export class Station extends MapEntity {
    override type: MapEntityType = "station"
    
    constructor() {
        super("city", 0)
    }

    override extractionAction(extraction: Extraction) {
        return {}
    }

    override canAttemptExtractionAction(extraction: Extraction) {
        return false
    }
} 