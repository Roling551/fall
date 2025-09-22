import { computed, Injectable } from "@angular/core";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile";
import { CreateSkillMapActionInfo, SkillMapActionFactoryService } from "../skill-map-action-factory.service";
import { CardCreationInfo } from "./actions-cards.service";
import { BorderComponent } from "../../shared/border/border.component";
import { TileInfo, UIStateService } from "../ui-state/ui-state.service";
import { CurrentLevelService } from "../current-level.service";

@Injectable({
  providedIn: 'root'
})
export class ActionCardCreationInfoFactoryService {

    constructor(
        private uiStateService: UIStateService,
        private levelService: CurrentLevelService,
        private skillMapActionFactoryService: SkillMapActionFactoryService
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

    instantExtractionCard(): CardCreationInfo {
        const affectedCoordinates = [new Coordinate(0,0)]
        const createActionInfo: CreateSkillMapActionInfo = {
            skills: new Map([["mining",1]]),
            times: 1
        } 
        return {
            name: "Extact",
            cardCreationInfo: [
                {
                    action:(tile: KeyValuePair<Coordinate, Tile>)=> {
                        this.skillMapActionFactoryService.createExtractionAction(createActionInfo, affectedCoordinates)(tile.value)
                        return true
                    },
                    tileInfos: new Map([this.getBorderInfo(affectedCoordinates)])
                }
            ],
            skillRequired: new Map([["construction", 2]]),
        }
    }

    // createEstateCard(estateType: string) {
    //     const createEstateInfo = this.estateFactoryService.getCreateEstateInfo(estateType)

    //     return this.createMultiStageActionCard(
    //         estateType,
    //         [
    //             {
    //                 action:(tile: KeyValuePair<Coordinate, Tile>)=> {
    //                     return getCreateEstateAction(this.levelService, this.turnActorsService, createEstateInfo.getEstate)(tile)
    //                 }, 
    //                 tileInfos: new Map([this.getBorderInfo(createEstateInfo.affectedCoordinates)])
    //             }
    //         ],
    //         new Map([["construction", 2]]),
    //         new Map([["oil", 1]])
    //     )
    // }

}