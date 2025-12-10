import { Injectable } from "@angular/core";
import { InjectorService } from "../injector.service";
import { CardInfo } from "../../models/card-info";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile/tile";
import { CharacterActionInfo } from "../../models/character-card-info";
import { SimpleTile } from "../../models/tile/simple-tile";
import { Resource } from "../../models/resource";
import { addNumericalValues, multiplyNumericalValuesFunctional, roundDownFunctional } from "../../util/map-functions";

export type CharacterActionInput = {
    name: "recycleActionCard",
    resourcesPerRecycled: number,
    repeatNumber?: number,
} | {
    name: "demolishEstate",
    refundFraction: number,
    repeatNumber?: number,
}

@Injectable({
  providedIn: 'root'
})
export class CharactersActionsService {
    constructor(private injectorService: InjectorService) {}

    getCharacterActionInfoAndDescription(input: CharacterActionInput): {actionInfo:CharacterActionInfo, actionDescription:string} {
        const repeatNumber = input.repeatNumber || 1
        switch(input.name) {
            case "recycleActionCard":
                return {
                    actionInfo: {
                        type: "Card",
                        canSelectCard: (card: CardInfo) => card.type == "ActionCard",
                        finishAction: (selectedCards:Map<number, CardInfo>) => {
                            this.recycleCards(selectedCards, input.resourcesPerRecycled)
                        },
                        repeatNumber
                    },
                    actionDescription: `Recycle card, get ${input.resourcesPerRecycled.toString()} scrap`
                }
            case "demolishEstate":
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
                    actionDescription: `Demolish estate, get ${input.refundFraction} of resources back`
                }
        }
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