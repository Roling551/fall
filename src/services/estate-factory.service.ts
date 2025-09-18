import { computed, Injectable } from "@angular/core";
import { Estate } from "../models/estate";
import { Tile } from "../models/tile";
import { Coordinate } from "../models/coordinate";
import { Skill } from "../models/skill";
import { CurrentLevelService } from "./current-level.service";
import { SkillMapActionFactoryService, CreateSkillMapActionInfo } from "./skill-map-action-factory.service";

export interface CreateEstateInfo {
    createActionInfo: CreateSkillMapActionInfo,
    getEstate: (tile: Tile) => Estate,
}

@Injectable({
  providedIn: 'root'
})
export class EstateFactoryService {

    map
    constructor(private actionFactoryService: SkillMapActionFactoryService, private currentLevelService: CurrentLevelService) {
        this.map = computed(()=>this.currentLevelService.level.get()?.map)
    }

    getCreateEstateInfo(): CreateEstateInfo {
        const skills = new Map<Skill, number>([["mining", 3]])
        const affectedCoordinates = [new Coordinate(0,0), new Coordinate(1,0)]
        const createActionInfo: CreateSkillMapActionInfo = {
            skills, 
            affectedCoordinates,
            times: 1
        }
        return {
            getEstate: (tile_: Tile) => new Estate(tile_, "farm", this.actionFactoryService.createExtractionAction(createActionInfo)),
            createActionInfo
        }
    }

}