import { computed, Injectable } from "@angular/core";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile";
import { CreateSkillMapActionInfo, SkillMapActionFactoryService } from "../skill-map-action-factory.service";
import { CardCreationInfo } from "./actions-cards.service";
import { BorderComponent } from "../../shared/border/border.component";
import { TileInfo, UIStateService } from "../ui-state/ui-state.service";
import { CurrentLevelService } from "../current-level.service";
import { Skill } from "../../models/skill";
import { Resource } from "../../models/resource";
import { getCreateEstateAction } from "./actions-cards-functions";
import { EstateFactoryService } from "../estate-factory.service";
import { TurnActorsService } from "../turn-actors.service";
import { Estate } from "../../models/estate";

export interface InstantExtractionCardInputs {
    name: string,
    skillRequired: Map<Skill, number>,
    skillApplied: Map<Skill, number>,
    affectedCoordinates: Coordinate[],
    price?: Map<Resource, number>,
    times?: number
}

export interface EstateCardInputs {
    name: string,
    skillRequired: Map<Skill, number>,
    skillApplied: Map<Skill, number>,
    affectedCoordinates: Coordinate[],
    estateTexture: string,
    runCost?: Map<Resource, number>,
    price?: Map<Resource, number>,
    times?: number
}

@Injectable({
  providedIn: 'root'
})
export class ActionCardCreationInfoFactoryService {

    constructor(
        private uiStateService: UIStateService,
        private levelService: CurrentLevelService,
        private skillMapActionFactoryService: SkillMapActionFactoryService,
        private estateFactoryService: EstateFactoryService,
        private turnActorsService: TurnActorsService,
    ) {}

    getBorderInfo(affectedCoordinates: Coordinate[]): [string, TileInfo] {
        const doRenderBorder = (tile:KeyValuePair<Coordinate, Tile>)=>{
            if(this.uiStateService.hoverTile()) {
                const doRender = affectedCoordinates.map(x=>x.addCoordinates(this.uiStateService.hoverTile()!.key)).map(x=>x.getKey()).includes(tile.key.getKey())
                return doRender
            }
            return false
        }
        return [
            "border", 
            {
                template: BorderComponent,
                doRender: doRenderBorder,
                input: {
                    getDirections: (tileInfoIsAbout: KeyValuePair<Coordinate, Tile>)=>{
                            return computed(() => {
                                const level = this.levelService.level.get()
                                if(!level) {
                                    return []
                                }
                                return level.map.getDirectionsFunction(doRenderBorder)(tileInfoIsAbout)()
                            })
                        }
                    }
            }
        ]
    }

    // exampleCard() {
    //    return this.createMultiStageActionCard(
    //         "c", 
    //         [
    //             {action:(tile: KeyValuePair<Coordinate, Tile>)=>{console.log("t1"); return tile.key.getKey()=="0_0"}},
    //             {action:(tile: KeyValuePair<Coordinate, Tile>)=>{console.log("t2"); return tile.key.getKey()=="0_0"}},
    //             {action:(tile: KeyValuePair<Coordinate, Tile>)=>{console.log("t3"); return tile.key.getKey()=="0_0"}},
    //         ],
    //         new Map([["construction", 2]]),
    //     )
    // }

    instantExtractionCard(
        inputs: InstantExtractionCardInputs
    ): CardCreationInfo {
        const createActionInfo: CreateSkillMapActionInfo = {
            skills: inputs.skillApplied,
            times: inputs.times!=undefined ? inputs.times : 1
        } 
        return {
            name: inputs.name,
            cardCreationInfo: [
                {
                    action:(tile: KeyValuePair<Coordinate, Tile>)=> {
                        this.skillMapActionFactoryService.createExtractionAction(createActionInfo, inputs.affectedCoordinates)(tile.value)
                        return true
                    },
                    tileInfos: new Map([this.getBorderInfo(inputs.affectedCoordinates)])
                }
            ],
            skillRequired: inputs.skillRequired,
            price: inputs.price,
        }
    }

    estateCard(inputs: EstateCardInputs): CardCreationInfo {
        const createActionInfo: CreateSkillMapActionInfo = {
            skills: inputs.skillApplied,
            times: inputs.times!=undefined ? inputs.times : 1
        } 
        const createEstateInfo = {
            getEstate: (tile_: Tile) => new Estate(
                tile_, 
                inputs.estateTexture, 
                inputs.runCost || (new Map([])), 
                inputs.affectedCoordinates, 
                this.skillMapActionFactoryService.createExtractionAction(
                    createActionInfo, 
                    inputs.affectedCoordinates)
                ),
            affectedCoordinates: inputs.affectedCoordinates,
            createActionInfo
        }
        return {
            name: inputs.name,
            cardCreationInfo:
            [
                {
                    action:(tile: KeyValuePair<Coordinate, Tile>)=> {
                        return getCreateEstateAction(
                            this.levelService,
                            this.turnActorsService,
                            createEstateInfo.getEstate)(tile)
                    }, 
                    tileInfos: new Map([this.getBorderInfo(createEstateInfo.affectedCoordinates)])
                }
            ],
            skillRequired: inputs.skillRequired,
            price: inputs.price,
        }
    }

}