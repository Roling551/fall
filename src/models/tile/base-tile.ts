import { Signal, signal } from "@angular/core"
import { createForceSignal } from "../../util/force-signal"
import { MapEntity, SkillActionResult } from "../map-entity"
import { Skill } from "../skill"
import { Tile } from "./tile"
import { Coordinate } from "../coordinate"
import { Obstacles } from "../obstacles"
import { Extraction } from "../extraction"

export abstract class BaseTile extends Tile {
    terrainType
    abstract mapEntities: Signal<MapEntity[]>

    override extractionAction(extraction: Extraction): SkillActionResult {
        for(const mapEntity of this.mapEntities()) {
            if(mapEntity.canAttemptExtractionAction(extraction)) {
                return mapEntity.extractionAction(extraction) 
            }
        }
        throw Error("Skill action can not be attempted")
    }
    override canAttemptExtractionAction(extraction: Extraction): boolean {
        for(const mapEntity of this.mapEntities()) {
            if(mapEntity.canAttemptExtractionAction(extraction)) {
                return true
            }
        }
        return false
    }

    constructor(
        coordinate: Coordinate,
        terrainType: string,
        obstacles: Obstacles = new Obstacles()
    ) {
        super(coordinate)
        this.terrainType = signal(terrainType)
        this.obstacles.set(obstacles)
    }
}
