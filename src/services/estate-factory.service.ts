import { Injectable } from "@angular/core";
import { Estate } from "../models/estate";
import { Tile } from "../models/tile";
import { addExistingNumericalValues, addToMapValue, withdrawFromMapValue } from "../util/map-functions";
import { Coordinate } from "../models/coordinate";
import { Skill } from "../models/skill";
import { ResourcesService } from "./resources.service";

export interface CreateEstateInfo {
    skills: Map<Skill, number>
    getEstate: (tile: Tile) => Estate,
    affectedCoordinate: Coordinate[]
}

@Injectable({
  providedIn: 'root'
})
export class EstateFactoryService {

    constructor(private resourcesService: ResourcesService) {}

    getCreateEstateInfo() {
        const skills = new Map<Skill, number>([["mining", 3]])
        return {
            getEstate: (tile_: Tile) => new Estate(tile_, "farm", this.getSimpleExtractionAction(skills)),
            skills,
            affectedCoordinate: [new Coordinate(0,0)]
        }
    }

    public getSimpleExtractionAction(skills: Map<Skill, number>, times: number=1) {
        return (tile: Tile)=>{
            let t = times
            for(const source of tile.resourcesSources.sources.get()) {
                let isSourceDone = false
                while(!isSourceDone) {
                    if(t <= 0) {
                        return
                    } else {
                        if(source.canAttempt(skills)) {
                            t -= 1
                            const actionResult = source.action(skills)
                            isSourceDone = actionResult.isFinished
                            addExistingNumericalValues(this.resourcesService.resources.get(), actionResult.resources)
                            this.resourcesService.resources.forceUpdate()
                        }
                    } 
                }
            }
        }
    }
}