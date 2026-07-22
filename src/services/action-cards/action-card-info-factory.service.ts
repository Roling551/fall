import { computed, Injectable } from "@angular/core";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile/tile";
import { CreateExtractionInfo, SkillMapActionFactoryService } from "../skill-map-action-factory.service";
import { BorderComponent } from "../../shared/border/border.component";
import { TileInfo, UIStateService } from "../ui-state/ui-state.service";
import { CurrentLevelService } from "../current-level.service";
import { Skill } from "../../models/skill";
import { Resource, resourcesToTextParts } from "../../models/resource";
import { getBorderInfo, getCreateEstateActionAndTileInfo, getCreateMultipleEstatesActionAndTileInfo } from "./actions-cards-functions";
import { TurnActorsService } from "../turn-actors.service";
import { Estate } from "../../models/estate";
import { ActionCardInfo, ActionCardType } from "../../models/action-card-info";
import { Reward, RewardOption } from "../../models/reward";
import { RewardFactoryService } from "../reward-factory.service";
import { TextPart } from "../../models/text-part";
import { Extraction } from "../../models/extraction";
import { CardInfo, CardUsesInfo, DefaultCardUsesInfo } from "../../models/card-info";
import { CardOverlayCardInfo } from "../../models/card-overlay-card-info";
import { InjectorService } from "../injector.service";
import { CardAttribute, CardAttributesService } from "../card-attributes.service";
import { CardOperationInput, CardsOperationsService, EstateInfoInput } from "../cards-operations.service";

export interface CardInput {
    name: string,
    type: ActionCardType,
    skillRequired: Map<Skill, number>,
    attributes?: CardAttribute[];
    operation: CardOperationInput
}

export interface CardOverlayCardInputs {
    name?: string,
    overlayedCardName: string,
    actionType: "buyCard",
    skillRequired?: Map<Skill, number>,
    price?: Map<Resource, number>,
}

// export interface InstantExtractionCardInputs {
//     type: "InstantExtractionCardInputs",
//     name: string,
//     skillRequired: Map<Skill, number>,
//     extraction: Extraction,
//     affectedCoordinates: Coordinate[],
//     cardPicture?: string,
//     price?: Map<Resource, number>,
//     times?: number,
//     cardOnHandRewards?: RewardOption[],
// }

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
        private injectorService: InjectorService,
        private attributesService: CardAttributesService,
        private cardsOperationsService: CardsOperationsService,
    ) {}

    createCard(input: CardInput) {
        const action = this.cardsOperationsService.getActionInfoAndDescription(input)
        let cardUsesInfo: CardUsesInfo | undefined = undefined
        if(input.type === "Estate") {
            cardUsesInfo = {
                ...DefaultCardUsesInfo,
                ...{   
                    refreshManually: true
                }
            }
        }
        const actionCard = new ActionCardInfo(
            input.name,
            input.type,
            action.actionInfo,
            false,
            input.skillRequired,
            input,
            [action.actionDescription],
            1,
            cardUsesInfo
        )
        return actionCard
    }

    cardOverlayCard(inputs: CardOverlayCardInputs): CardOverlayCardInfo {
        return new CardOverlayCardInfo(
            inputs.name || ("broken "+inputs.overlayedCardName),
            this.injectorService.getActionCardInfoList().getCardByIdentifier(inputs.overlayedCardName),
            inputs.skillRequired,
            inputs.price
        )
    }

        // instantExtractionCard(
    //     inputs: InstantExtractionCardInputs
    // ): ActionCardInfo {
    //     const createExtractionInfo: CreateExtractionInfo = {
    //         extraction: inputs.extraction,
    //         times: inputs.times!=undefined ? inputs.times : 1
    //     }
    //     const effectsDescriptions: TextPart[][] = []
    //     if(inputs.extraction) {
    //         effectsDescriptions.push(["apply:", ...inputs.extraction.getTextParts()])
    //     }
    //     const mapInteractionAction = this.skillMapActionFactoryService.createMapInteractionAction(createExtractionInfo, inputs.affectedCoordinates)
    //     const mapCollectAction = this.skillMapActionFactoryService.createMapGatheringAction(createExtractionInfo, inputs.affectedCoordinates)
    //     return new ActionCardInfo(
    //         inputs.name,
    //         false,
    //         inputs.skillRequired,
    //         // {
    //         //     action:(tile: KeyValuePair<Coordinate, Tile>)=> {
    //         //         mapInteractionAction(tile.value)
    //         //         mapCollectAction(tile.value)
    //         //         return true
    //         //     },
    //         //     tileInfos: new Map([getBorderInfo(this.uiStateService, this.levelService, inputs.affectedCoordinates)])
    //         // },
    //         inputs,
    //         effectsDescriptions,
    //         5,
    //         inputs.cardPicture,
    //         inputs.price,
    //         this.rewardFactoryService.createRewards(inputs.cardOnHandRewards),
    //     )
    // }
}