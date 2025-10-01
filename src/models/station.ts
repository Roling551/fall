import { MapEntity, MapEntityType } from "./map-entity";
import { Skill } from "./skill";

export class Station extends MapEntity {
    override type: MapEntityType = "station"
    
    constructor() {
        super("city", 0)
    }

    override skillAction(skills: Map<Skill,number>) {
        return {}
    }

    override canAttemptSkillAction(skills: Map<Skill,number>) {
        return false
    }
} 