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
import { getBorderInfo, getCreateEstateActionAndTileInfo, getCreateMultipleEstatesActionAndTileInfo } from "./actions-cards-functions";
import { TurnActorsService } from "../turn-actors.service";
import { Estate } from "../../models/estate";
import { ActionCardInfo } from "../../models/action-card-info";
import { Reward, RewardOption } from "../../models/reward";
import { RewardFactoryService } from "../reward-factory.service";

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
    cardPicture?: string,
    price?: Map<Resource, number>,
    times?: number,
    cardOnHandRewards?: RewardOption[],
}

export interface EstateCardInputs {
    type: "EstateCardInputs",
    name: string,
    skillRequired: Map<Skill, number>,
    skillApplied?: Map<Skill, number>,
    affectedCoordinates?: Coordinate[],
    estateTexture: string,
    runCost?: Map<Resource, number>,
    cardPicture?: string,
    price?: Map<Resource, number>,
    times?: number,
    skillMapActionSkillBonus?: Map<Skill, number>,
    movementBonus?: number
    cardOnHandRewards?: RewardOption[],
    isUpgrade?: boolean,
    instancesNumber?: number,
}

@Injectable({
  providedIn: 'root'
})
export class ActionCardInfoFactoryService {

    constructor(
        private uiStateService: UIStateService,
        private levelService: CurrentLevelService,
        private skillMapActionFactoryService: SkillMapActionFactoryService,
        private turnActorsService: TurnActorsService,
        private rewardFactoryService: RewardFactoryService,
    ) {}

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
                    tileInfos: new Map([getBorderInfo(this.uiStateService, this.levelService, inputs.affectedCoordinates)])
                }
            ],
            inputs,
            effectsDescriptions,
            inputs.cardPicture,
            inputs.price,
            this.rewardFactoryService.createRewards(inputs.cardOnHandRewards),
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
        const mapEntityType = inputs.isUpgrade ? "upgrade" : "estate"
        const affectedCoordinates = inputs.affectedCoordinates || [new Coordinate(0,0)]
        const createEstateInfo = {
            getEstate: (tile_: Tile) => new Estate(
                tile_, 
                inputs.estateTexture, 
                inputs.runCost || (new Map([])), 
                affectedCoordinates,
                inputs,
                (!!createActionInfo) ? this.skillMapActionFactoryService.createExtractionAction(
                    createActionInfo, 
                    affectedCoordinates)
                : undefined,
                inputs.skillMapActionSkillBonus,
                inputs.movementBonus,
                actionCardInfo,
                mapEntityType
            ),
            affectedCoordinates: inputs.affectedCoordinates,
            createActionInfo,
        }
        const estatesActionAndTileInfo = inputs.instancesNumber===undefined ?
            getCreateEstateActionAndTileInfo(
                this.uiStateService,
                this.levelService,
                this.turnActorsService,
                createEstateInfo.getEstate,
                mapEntityType,
                affectedCoordinates
            ) : getCreateMultipleEstatesActionAndTileInfo(
                this.uiStateService,
                this.levelService,
                this.turnActorsService,
                createEstateInfo.getEstate,
                mapEntityType,
                affectedCoordinates,
                inputs.instancesNumber
            )
        actionCardInfo = new ActionCardInfo(
            inputs.name,
            inputs.instancesNumber===undefined,
            inputs.skillRequired,
            [
                estatesActionAndTileInfo
            ],
            inputs,
            effectsDescriptions,
            inputs.cardPicture,
            inputs.price,
            this.rewardFactoryService.createRewards(inputs.cardOnHandRewards),
        )
        return actionCardInfo
    }
}