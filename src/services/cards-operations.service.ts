import { computed, Injectable, signal } from "@angular/core";
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
import { getCreateEstateActionAndTileInfo } from "./action-cards/actions-cards-functions";
import { CurrentLevelService } from "./current-level.service";
import { TurnActorsService } from "./turn-actors.service";
import { UIStateService } from "./ui-state/ui-state.service";
import { ActionCardInfoFactoryService, CardInput } from "./action-cards/action-card-info-factory.service";
import { ActionCardInfo } from "../models/action-card-info";

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
    cardsGenerated?: CardInput[];
    //attributes?: CardAttribute[];
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
        private cardAttributesService: CardAttributesService,
    ) {}

    getActionInfoAndDescription(input: CardInput): {actionInfo:CardsActionInfo, actionDescription:TextPart[]} {
        const operationInput = input.operation
        switch(operationInput.name) {
            case "recycleActionCard": {
                const repeatNumber = operationInput.repeatNumber || 1
                return {
                    actionInfo: {
                        type: "Card",
                        canSelectCard: (card: CardInfo) => card.type == "ActionCard",
                        finishAction: (usedCard: CardInfo, selectedCards:Map<number, CardInfo>) => {
                            this.recycleCards(selectedCards, operationInput.resourcesPerRecycled)
                        },
                        repeatNumber
                    },
                    actionDescription: [`Recycle card, get ${operationInput.resourcesPerRecycled.toString()} `, {type: "emoticon",emoticon: "scrap"}]
                }
            }
            case "demolishEstate": {
                const repeatNumber = operationInput.repeatNumber || 1
                return {
                    actionInfo: {
                        type: "Tile",
                        canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>)=>{
                            return this.canDemolishEstate(selectedTile)
                        },
                        finishAction: (usedCard: CardInfo, selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => {
                            this.demolishEstates(selectedTiles, operationInput.refundFraction)
                        },
                        repeatNumber
                    },
                    actionDescription: [`Demolish estate, get ${operationInput.refundFraction} of resources back`]
                }
            }
            case "getReward":
                return {
                    actionInfo: {
                        type: "Reward",
                        reward: operationInput.reward
                    },
                    actionDescription: operationInput.reward.getTextParts()
                }
            case "buildEstate":
                let effectsDescriptions = computed(()=>{
                    return [
                        ...Estate.getEffectsDescriptionsFunction(operationInput.estateInfo)(), 
                        ...(input.attributes ? this.attributesService.getAttributesDescribtions(input.attributes) : [])
                    ]
                })
                return {
                    actionInfo: {
                        type: "Tile",
                        canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>)=>{
                            return true
                        },
                        finishAction: (usedCard: CardInfo, selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => {
                            for(const tile of selectedTiles) {
                                this.buildEstate(usedCard, operationInput.estateInfo, input, tile[1])
                            }
                        },
                        repeatNumber: operationInput.estateInfo.instancesNumber
                    },
                    actionDescription: effectsDescriptions().flatMap(x=>x)
                }
        }
    }

    private buildEstate(usedCard: CardInfo, estateInputs: EstateInfoInput, cardInput: CardInput, tile: KeyValuePair<Coordinate, Tile>) {
        const createActionInfo: CreateExtractionInfo | undefined = (!!estateInputs.extraction) ? {
            extraction: estateInputs.extraction,
            times: estateInputs.times!=undefined ? estateInputs.times : 1
        } : undefined

        const mapEntityType = estateInputs.isUpgrade ? "upgrade" : "estate"

        const affectedCoordinates = estateInputs.affectedCoordinates || [new Coordinate(0,0)]

        const attrubitesInputs = signal({location: tile.key})

        const createEstate = (tile_: Tile) => new Estate(
                tile_, 
                estateInputs.estateTexture, 
                estateInputs.runCost || (new Map([])), 
                affectedCoordinates,
                estateInputs,
                estateInputs.price || new Map(),
                3,
                this.attributesService.getAttributesEstatesEffects(signal(cardInput.attributes!), attrubitesInputs),
                (!!createActionInfo) ? this.skillMapActionFactoryService.createMapInteractionAction(
                    createActionInfo, 
                    affectedCoordinates,
                    cardInput.attributes)
                : undefined,
                (!!createActionInfo) ? this.skillMapActionFactoryService.createMapGatheringAction(
                    createActionInfo, 
                    affectedCoordinates)
                : undefined,
                estateInputs.producedResources,
                estateInputs.tileBonus,
                estateInputs.movementBonus,
                estateInputs.cardsGenerated?.map(x=>this.injectorService.getActionCardInfoFactoryService().createCard(x)),
                usedCard,
                estateInputs.estateTexture,
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
                entity.onDestroy()
                this.injectorService.getTurnActorsService().removeActor(entity)
            }   
        }
        this.injectorService.getResourcesService().addResources(roundDownFunctional(multiplyNumericalValuesFunctional(price, refundFraction)))
    }
}