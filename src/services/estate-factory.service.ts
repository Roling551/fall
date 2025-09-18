import { computed, Injectable } from "@angular/core";
import { Estate } from "../models/estate";
import { Tile } from "../models/tile";
import { addExistingNumericalValues, addToMapValue, withdrawFromMapValue } from "../util/map-functions";
import { Coordinate } from "../models/coordinate";
import { Skill } from "../models/skill";
import { ResourcesService } from "./resources.service";
import { CurrentLevelService } from "./current-level.service";

export interface CreateEstateInfo {
    skills: Map<Skill, number>
    getEstate: (tile: Tile) => Estate,
    affectedCoordinate: Coordinate[]
}

@Injectable({
  providedIn: 'root'
})
export class EstateFactoryService {

    map
    constructor(private resourcesService: ResourcesService, private currentLevelService: CurrentLevelService) {
        this.map = computed(()=>this.currentLevelService.level.get()?.map)
    }

    getCreateEstateInfo() {
        const skills = new Map<Skill, number>([["mining", 3]])
        const affectedCoordinates = [new Coordinate(0,0), new Coordinate(1,0)]
        return {
            getEstate: (tile_: Tile) => new Estate(tile_, "farm", this.getSimpleExtractionAction(skills, affectedCoordinates)),
            skills,
            affectedCoordinates
        }
    }

    public getSimpleExtractionAction(skills: Map<Skill, number>, affectedCoordinates = [new Coordinate(0,0)], times: number=1) {
        return (tile: Tile)=>{
            const map = this.map()
            if(!map) {
                return
            }
            for(let i = 0; i<times; i++) {
                const tiles = affectedCoordinates
                    .map(c=>map.getTile(tile.coordinate.addCoordinates(c)))
                    .filter(t=>!!t)
                    .map(t=>t.value)
                for(const t of tiles) {
                    for(const source of t.resourcesSources.sources.get()) {
                        if(source.canAttempt(skills)) {
                            const actionResult = source.action(skills)
                            addExistingNumericalValues(this.resourcesService.resources.get(), actionResult.resources)
                            this.resourcesService.resources.forceUpdate()
                        }
                    }
                }
            }
        }
    }
}