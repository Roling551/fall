import { computed, Injectable } from "@angular/core";
import { Reward, RewardOption } from "../models/reward";
import { CardInfo } from "../models/card-info";
import { Coordinate } from "../models/coordinate";
import { KeyValuePair } from "../models/key-value-pair";
import { TextPart } from "../models/text-part";
import { SimpleTile } from "../models/tile/simple-tile";
import { Tile } from "../models/tile/tile";
import { addNumericalValues, roundDownFunctional, multiplyNumericalValuesFunctional } from "../util/map-functions";
import { CardsActionInfo } from "./cards-actions.service";
import { InjectorService } from "./injector.service";
import { Resource } from "../models/resource";
import { Extraction } from "../models/extraction";
import { CardAttribute, CardAttributesService } from "./card-attributes.service";
import { TileBonus } from "../models/bonus";
import { CreateExtractionInfo, SkillMapActionFactoryService } from "./skill-map-action-factory.service";
import { Estate } from "../models/estate";
import { Skill } from "../models/skill";
import { getCreateEstateActionAndTileInfo } from "./action-cards/actions-cards-functions";
import { CurrentLevelService } from "./current-level.service";
import { TurnActorsService } from "./turn-actors.service";
import { UIStateService } from "./ui-state/ui-state.service";

export interface EstateInfoInput {
    name: string;
    extraction?: Extraction;
    affectedCoordinates?: Coordinate[];
    estateTexture: string;
    runCost?: Map<Resource, number>;
    cardPicture?: string;
    price?: Map<Resource, number>;
    times?: number;
    tileBonus?: TileBonus;
    movementBonus?: number;
    attributes?: CardAttribute[];
    cardOnHandRewards?: RewardOption[];
    producedResources?: Map<Resource, number>;
    isUpgrade?: boolean;
    instancesNumber?: number;
}

export type CardOperationInput = {
    name: "recycleActionCard";
    resourcesPerRecycled: number;
    repeatNumber?: number;
} | {
    name: "demolishEstate";
    refundFraction: number;
    repeatNumber?: number;
} | {
    name: "getReward";
    reward: Reward;
} | {
    name: "buildEstate";
    estateInfo: EstateInfoInput
};

@Injectable({
  providedIn: 'root'
})
export class CardsOperationsService {
    constructor(
        private injectorService: InjectorService,
        private skillMapActionFactoryService: SkillMapActionFactoryService,
        private attributesService: CardAttributesService,
        private uiStateService: UIStateService,
        private levelService: CurrentLevelService,
        private turnActorsService: TurnActorsService,
    ) {}

    getActionInfoAndDescription(input: CardOperationInput): {actionInfo:CardsActionInfo, actionDescription:TextPart[]} {
        switch(input.name) {
            case "recycleActionCard": {
                const repeatNumber = input.repeatNumber || 1
                return {
                    actionInfo: {
                        type: "Card",
                        canSelectCard: (card: CardInfo) => card.type == "ActionCard",
                        finishAction: (selectedCards:Map<number, CardInfo>) => {
                            this.recycleCards(selectedCards, input.resourcesPerRecycled)
                        },
                        repeatNumber
                    },
                    actionDescription: [`Recycle card, get ${input.resourcesPerRecycled.toString()} `, {type: "emoticon",emoticon: "scrap"}]
                }
            }
            case "demolishEstate": {
                const repeatNumber = input.repeatNumber || 1
                return {
                    actionInfo: {
                        type: "Tile",
                        canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>)=>{
                            return this.canDemolishEstate(selectedTile)
                        },
                        finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => {
                            this.demolishEstates(selectedTiles, input.refundFraction)
                        },
                        repeatNumber
                    },
                    actionDescription: [`Demolish estate, get ${input.refundFraction} of resources back`]
                }
            }
            case "getReward":
                return {
                    actionInfo: {
                        type: "Reward",
                        reward: input.reward
                    },
                    actionDescription: input.reward.getTextParts()
                }
            case "buildEstate":
                return {
                    actionInfo: {
                        type: "Tile",
                        canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>)=>{
                            return true
                        },
                        finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => {
                            for(const tile of selectedTiles) {
                                this.buildEstate(input.estateInfo, tile[1])
                            }
                        },
                        repeatNumber: input.estateInfo.instancesNumber
                    },
                    actionDescription: []
                }
        }
    }

    private buildEstate(inputs: EstateInfoInput, tile: KeyValuePair<Coordinate, Tile>) {

        const createActionInfo: CreateExtractionInfo | undefined = (!!inputs.extraction) ? {
            extraction: inputs.extraction,
            times: inputs.times!=undefined ? inputs.times : 1
        } : undefined

        const mapEntityType = inputs.isUpgrade ? "upgrade" : "estate"

        let effectsDescriptions = computed(()=>{
            return [
                ...Estate.getEffectsDescriptionsFunction(inputs)(), 
                ...(inputs.attributes ? this.attributesService.getAttributesDescribtions(inputs.attributes) : [])
            ]
        })

        const affectedCoordinates = inputs.affectedCoordinates || [new Coordinate(0,0)]

        const createEstate = (tile_: Tile) => new Estate(
                tile_, 
                inputs.estateTexture, 
                inputs.runCost || (new Map([])), 
                affectedCoordinates,
                inputs,
                inputs.price || new Map(),
                3,
                (!!createActionInfo) ? this.skillMapActionFactoryService.createMapInteractionAction(
                    createActionInfo, 
                    affectedCoordinates,
                    inputs.attributes)
                : undefined,

                (!!createActionInfo) ? this.skillMapActionFactoryService.createMapGatheringAction(
                    createActionInfo, 
                    affectedCoordinates)
                : undefined,
                inputs.producedResources,
                inputs.tileBonus,
                inputs.movementBonus,
                undefined,
                inputs.estateTexture,
                mapEntityType
            )
        const estatesActionAndTileInfo =
            getCreateEstateActionAndTileInfo(
                this.uiStateService,
                this.levelService,
                this.turnActorsService,
                createEstate,
                mapEntityType,
                affectedCoordinates
            )
        estatesActionAndTileInfo.action(tile)
    }

    private recycleCards(selectedCards:Map<number, CardInfo>, resourcesPerRecycled: number) {
        let removedNumber = this.injectorService.getActionsCardsService()
            .removeCardsFromHandAndCount([...selectedCards.values()])
        this.injectorService.getResourcesService().addResources(new Map([["scrap", resourcesPerRecycled * removedNumber]]))
    }

    private canDemolishEstate(selectedTile: KeyValuePair<Coordinate, Tile>) {
        const t = selectedTile.value
        if(t instanceof SimpleTile) {
            return t.containsPlayersMapEntity()
        }
        return false
    }

    private demolishEstates(selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>, refundFraction: number) {
        let price = new Map<Resource, number>([])
        for(const tile of selectedTiles) {
            const t = tile[1].value
            if(t instanceof SimpleTile) {
                const entity = t.removePlayersMapEntity()
                if(!entity) {
                    return
                }
                addNumericalValues(price, entity.costPaid)
                if(entity.actionCardGetAfterDestroy) {
                    this.injectorService.getActionsCardsService().addNewCardToDiscard(entity.actionCardGetAfterDestroy)
                }
                this.injectorService.getTurnActorsService().removeActor(entity)
            }   
        }
        this.injectorService.getResourcesService().addResources(roundDownFunctional(multiplyNumericalValuesFunctional(price, refundFraction)))
    }
}