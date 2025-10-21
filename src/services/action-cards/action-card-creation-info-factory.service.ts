import { computed, Injectable } from "@angular/core";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile/tile";
import { CreateSkillMapActionInfo, SkillMapActionFactoryService } from "../skill-map-action-factory.service";
import { BorderComponent } from "../../shared/border/border.component";
import { TileInfo, UIStateService } from "../ui-state/ui-state.service";
import { CurrentLevelService } from "../current-level.service";
import { Skill, skillsToString } from "../../models/skill";
import { Resource } from "../../models/resource";
import { getCreateEstateAction } from "./actions-cards-functions";
import { EstateFactoryService } from "../estate-factory.service";
import { TurnActorsService } from "../turn-actors.service";
import { Estate } from "../../models/estate";
import { CardOnHandBenefit } from "../../models/card-on-hand-benefit";
import { ActionCardInfo } from "../../models/action-card-info";

export type FactoryCardInputs = InstantExtractionCardInputs | EstateCardInputs

export function getFactoryCardInputsReadable(type: "InstantExtractionCardInputs" | "EstateCardInputs") {
    switch(type) {
        case "InstantExtractionCardInputs":
            return "Instant"
        case "EstateCardInputs":
            return "Estate"
    }
}

export interface InstantExtractionCardInputs {
    type: "InstantExtractionCardInputs",
    name: string,
    skillRequired: Map<Skill, number>,
    skillApplied: Map<Skill, number>,
    affectedCoordinates: Coordinate[],
    price?: Map<Resource, number>,
    times?: number,
    cardOnHandBenefits?: CardOnHandBenefit[],
}

export interface EstateCardInputs {
    type: "EstateCardInputs",
    name: string,
    skillRequired: Map<Skill, number>,
    skillApplied?: Map<Skill, number>,
    affectedCoordinates: Coordinate[],
    estateTexture: string,
    runCost?: Map<Resource, number>,
    price?: Map<Resource, number>,
    times?: number,
    skillMapActionSkillBonus?: Map<Skill, number>,
    movementBonus?: number
    cardOnHandBenefits?: CardOnHandBenefit[],
    isUpgrade?: boolean
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
    ): ActionCardInfo {
        const createActionInfo: CreateSkillMapActionInfo = {
            skills: inputs.skillApplied,
            times: inputs.times!=undefined ? inputs.times : 1
        }
        const effectsDescriptions: string[] = []
        if(inputs.skillApplied) {
            effectsDescriptions.push("apply:" + skillsToString(inputs.skillApplied))
        }
        return new ActionCardInfo(
            inputs.name,
            false,
            inputs.skillRequired,
            [
                {
                    action:(tile: KeyValuePair<Coordinate, Tile>)=> {
                        this.skillMapActionFactoryService.createExtractionAction(createActionInfo, inputs.affectedCoordinates)(tile.value)
                        return true
                    },
                    tileInfos: new Map([this.getBorderInfo(inputs.affectedCoordinates)])
                }
            ],
            inputs,
            effectsDescriptions,
            inputs.price,
            inputs.cardOnHandBenefits,
        )
    }

    estateCard(inputs: EstateCardInputs): ActionCardInfo {
        const createActionInfo: CreateSkillMapActionInfo | undefined = (!!inputs.skillApplied) ? {
            skills: inputs.skillApplied,
            times: inputs.times!=undefined ? inputs.times : 1
        } : undefined

        const effectsDescriptions: string[] = []
        if(inputs.skillApplied) {
            effectsDescriptions.push("apply:" + skillsToString(inputs.skillApplied))
        }
        if(inputs.skillMapActionSkillBonus) {
            effectsDescriptions.push("bonus:" + skillsToString(inputs.skillMapActionSkillBonus))
        }
        if(inputs.movementBonus) {
            effectsDescriptions.push("move:+" + inputs.movementBonus)
        }

        let actionCardInfo: ActionCardInfo 
        const createEstateInfo = {
            getEstate: (tile_: Tile) => new Estate(
                tile_, 
                inputs.estateTexture, 
                inputs.runCost || (new Map([])), 
                inputs.affectedCoordinates,
                effectsDescriptions,
                (!!createActionInfo) ? this.skillMapActionFactoryService.createExtractionAction(
                    createActionInfo, 
                    inputs.affectedCoordinates)
                : undefined,
                inputs.skillMapActionSkillBonus,
                inputs.movementBonus,
                actionCardInfo,
                inputs.isUpgrade ? "upgrade" : "estate"
            ),
            affectedCoordinates: inputs.affectedCoordinates,
            createActionInfo,
        }
        actionCardInfo = new ActionCardInfo(
            inputs.name,
            true,
            inputs.skillRequired,
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
            inputs,
            effectsDescriptions,
            inputs.price,
            inputs.cardOnHandBenefits,
        )
        return actionCardInfo
    }
}