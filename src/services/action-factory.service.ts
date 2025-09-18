import { computed, Injectable } from "@angular/core";
import { Skill } from "../models/skill";
import { Coordinate } from "../models/coordinate";
import { Tile } from "../models/tile";
import { ResourcesService } from "./resources.service";
import { addExistingNumericalValues } from "../util/map-functions";
import { CurrentLevelService } from "./current-level.service";

export interface CreateActionInfo {
    skills: Map<Skill, number>
    affectedCoordinates: Coordinate[]
    times: number
}

@Injectable({
  providedIn: 'root'
})
export class ActionFactoryService {
    
    map
    constructor(private resourcesService: ResourcesService, private currentLevelService: CurrentLevelService) {
        this.map = computed(()=>this.currentLevelService.level.get()?.map)
    }

    public createExtractionAction(createActionInfo: CreateActionInfo) {
        const times = createActionInfo.times || 1
        const skills = createActionInfo.skills
        const affectedCoordinates = createActionInfo.affectedCoordinates || [new Coordinate(0,0)]
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