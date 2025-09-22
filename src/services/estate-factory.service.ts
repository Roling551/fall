import { computed, Injectable } from "@angular/core";
import { Estate } from "../models/estate";
import { Tile } from "../models/tile";
import { Coordinate } from "../models/coordinate";
import { Skill } from "../models/skill";
import { CurrentLevelService } from "./current-level.service";
import { SkillMapActionFactoryService, CreateSkillMapActionInfo } from "./skill-map-action-factory.service";
import { Resource } from "../models/resource";

export interface CreateEstateInfo {
    createActionInfo?: CreateSkillMapActionInfo,
    affectedCoordinates: Coordinate[],
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

    getCreateEstateInfo(estateType: string): CreateEstateInfo {
        if(estateType=="extraction") {
            const skills = new Map<Skill, number>([["mining", 3]])
            const requiredResources: Map<Resource, number> = new Map([["oil", 1]])
            const affectedCoordinates = [new Coordinate(0,0), new Coordinate(1,0)]
            const createActionInfo: CreateSkillMapActionInfo = {
                skills, 
                times: 1
            }
            return {
                getEstate: (tile_: Tile) => new Estate(tile_, "farm", requiredResources, affectedCoordinates, this.actionFactoryService.createExtractionAction(createActionInfo, affectedCoordinates)),
                affectedCoordinates,
                createActionInfo
            }
        } else {
            const requiredResources: Map<Resource, number> = new Map([["oil", 1]])
            const affectedCoordinates = [new Coordinate(0,0), new Coordinate(1,0)]
            return {
                getEstate: (tile_: Tile) => new Estate(tile_, "mine", requiredResources, affectedCoordinates, undefined, new Map([["mining",1]])),
                affectedCoordinates
            }
        }
    }

}