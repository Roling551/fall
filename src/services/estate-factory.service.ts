import { Injectable } from "@angular/core";
import { Estate } from "../models/estate";
import { WorldStateService } from "./world-state/world-state.service";
import { Tile } from "../models/tile";
import { addExistingNumericalValues, addToMapValue, withdrawFromMapValue } from "../util/map-functions";
import { Resource } from "../models/resource";
import { withdrawFromObjectsValue } from "../util/object-numerical-functions";
import { Coordinate } from "../models/coordinate";
import { Skill } from "../models/skill";

export interface CreateEstateInfo {
    skills: Map<Skill, number>
    getEstate: (tile: Tile) => Estate,
    affectedCoordinate: Coordinate[]
}

@Injectable({
  providedIn: 'root'
})
export class EstateFactoryService {

    constructor(private worldStateService: WorldStateService) {}

    getCreateEstateInfo() {
        const skills = new Map<Skill, number>([["mining", 3]])
        return {
            getEstate: (tile_: Tile) => new Estate(tile_, "farm", this.getSimpleExtractionAction(skills)),
            skills,
            affectedCoordinate: [new Coordinate(0,0)]
        }
    }

    private getSimpleExtractionAction(skills: Map<Skill, number>, times: number=1) {
        return (tile: Tile)=>{
            let t = times
            for(const source of tile.resourceSources.get()) {
                let isSourceDone = false
                while(!isSourceDone) {
                    if(t <= 0) {
                        return
                    } else {
                        if(source.canAttempt(skills)) {
                            t -= 1
                            const actionResult = source.action(skills)
                            isSourceDone = actionResult.isFinished
                            addExistingNumericalValues(this.worldStateService.resources.get(), actionResult.resources)
                            this.worldStateService.resources.forceUpdate()
                        }
                    } 
                }
            }
        }
    }
}