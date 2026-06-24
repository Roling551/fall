import { Injectable } from "@angular/core";
import { CardInfo } from "../models/card-info";
import { Coordinate } from "../models/coordinate";
import { KeyValuePair } from "../models/key-value-pair";
import { Tile } from "../models/tile/tile";
import { Reward } from "../models/reward";
import { createInstantAction, createRepeatCardAction, createMapAction } from "./ui-state/create-player-action";
import { UIStateService } from "./ui-state/ui-state.service";
import { CurrentLevelService } from "./current-level.service";

export type CardsActionInfo = {
    type: "Card";
    canSelectCard: (card: CardInfo) => boolean;
    finishAction: (usedCard: CardInfo, selectedCards: Map<number, CardInfo>) => void;
    repeatNumber: number;
} | {
    type: "Tile";
    canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>) => boolean;
    finishAction: (usedCard: CardInfo, selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>) => void;
    repeatNumber?: number;
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

    public setCardsAction(card: CardInfo, actionInfo: CardsActionInfo, onCardUse: ()=> void, deselectAllCards: ()=>void) {
        if(actionInfo.type === "Card") {
            card.onSelect = ()=>{
                createRepeatCardAction(
                    this.uiStateService,
                    actionInfo.canSelectCard,
                    (selectedCards:Map<number, CardInfo>)=>{
                        actionInfo.finishAction(card, selectedCards)
                        onCardUse()
                    },
                    ()=>{
                        deselectAllCards()
                    },
                    actionInfo.repeatNumber
                )
                return true
            }
        } else if(actionInfo.type === "Tile") {
            card.onSelect = ()=>{
                createMapAction(
                    this.uiStateService,
                    this.currentLevelService,
                    (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>)=>{
                        actionInfo.finishAction(card, selectedTiles)
                        onCardUse()
                    },
                    (selectedTile: KeyValuePair<Coordinate, Tile>) => {
                        return actionInfo.canSelectTile(selectedTile)
                    },
                    ()=>{
                        deselectAllCards()
                    },
                    3,
                    undefined,
                    actionInfo.repeatNumber
                )
                return true
            }
        } else if(actionInfo.type === "Reward") {
            card.onSelect = (selectCardInfo?:any)=>{
                if(selectCardInfo && selectCardInfo["canSetAction"]?.()) {
                    createInstantAction(
                        this.uiStateService,
                        ()=>{
                            actionInfo.reward.claim()
                            onCardUse()
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