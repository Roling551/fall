import { Injectable } from "@angular/core";
import { InjectorService } from "./injector.service";
import { CardInfo } from "../models/card-info";
import { Coordinate } from "../models/coordinate";
import { KeyValuePair } from "../models/key-value-pair";
import { Tile } from "../models/tile/tile";
import { SimpleTile } from "../models/tile/simple-tile";
import { Resource } from "../models/resource";
import { addNumericalValues, multiplyNumericalValuesFunctional, roundDownFunctional } from "../util/map-functions";
import { Reward } from "../models/reward";
import { TextPart } from "../models/text-part";
import { ActionCardInfo } from "../models/action-card-info";
import { createInstantAction, createRepeatCardAction, createRepeatMapAction } from "./ui-state/create-player-action";
import { UIStateService } from "./ui-state/ui-state.service";
import { CurrentLevelService } from "./current-level.service";
import { CardsHand } from "../models/card-hands/cards-hand";
import { CardOperationInput } from "./cards-operations.service";

export type CardsActionInfo = {
    type: "Card";
    canSelectCard: (card: CardInfo) => boolean;
    finishAction: (selectedCards: Map<number, CardInfo>) => void;
    repeatNumber: number;
} | {
    type: "Tile";
    canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>) => boolean;
    finishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => void;
    repeatNumber: number;
} | {
    type: "Reward";
    reward: Reward;
};

@Injectable({
  providedIn: 'root'
})
export class CardsActionsService {
    constructor(
        private uiStateService: UIStateService,
        private currentLevelService: CurrentLevelService
    ) {}

    public setCardsAction(card: CardInfo, actionInfo: CardsActionInfo, discardCard: ()=> void, deselectAllCards: ()=>void) {
        if(actionInfo.type === "Card") {
            card.onSelect = (selectCardInfo?:any)=>{
                if(selectCardInfo && selectCardInfo["canSetAction"]?.()) {
                    createRepeatCardAction(
                        this.uiStateService,
                        actionInfo.canSelectCard,
                        (selectedCards:Map<number, CardInfo>)=>{
                            actionInfo.finishAction(selectedCards)
                            discardCard()
                        },
                        ()=>{
                            deselectAllCards()
                        },
                        actionInfo.repeatNumber
                    )
                }
                return true
            }
        } else if(actionInfo.type === "Tile") {
            card.onSelect = (selectCardInfo?:any)=>{
                if(selectCardInfo && selectCardInfo["canSetAction"]?.()) {
                    createRepeatMapAction(
                        this.uiStateService,
                        this.currentLevelService,
                        actionInfo.canSelectTile,
                        (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>)=>{
                            actionInfo.finishAction(selectedTiles)
                            discardCard()
                        },
                        ()=>{
                            deselectAllCards()
                        },
                        actionInfo.repeatNumber
                    )
                }
                return true
            }
        } else if(actionInfo.type === "Reward") {
            card.onSelect = (selectCardInfo?:any)=>{
                if(selectCardInfo && selectCardInfo["canSetAction"]?.()) {
                    createInstantAction(
                        this.uiStateService,
                        ()=>{
                            actionInfo.reward.claim()
                            discardCard()
                        },
                        ()=>{
                            deselectAllCards()
                        }
                    )
                }
                return true
            }
        }

    }
}