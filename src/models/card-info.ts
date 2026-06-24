import { signal } from "@angular/core";
import { Coordinate } from "./coordinate";
import { KeyValuePair } from "./key-value-pair";
import { Tile } from "./tile/tile";

export type CardInfoType = "ActionCard" | "CharacterCard" | "CardOverlayCard"

export type CardUsesInfo = {
    maxUses: number,
    usesPerRefresh: number,
    turnsForRefresh: number,
    refreshManually: boolean,
}

const defaultCardUsesInfo: CardUsesInfo = {
    maxUses: 1,
    usesPerRefresh: 1,
    turnsForRefresh: 1,
    refreshManually: false,
}

export abstract class CardInfo {
    static cardsAmount = 0
    id: number = 0
    avaliable = signal(true)
    usesLeft = signal(0)
    turnsForRefreshLeft = signal(0)
    cardUsesInfo: CardUsesInfo
    public onUse: ()=> void
    public onTurnEnd: ()=> void
    constructor(
        public name: string, 
        public type: CardInfoType,
        cardUsesInfo?: CardUsesInfo,
        public onSelect?: (()=>boolean),
    ){
        this.cardUsesInfo = {...defaultCardUsesInfo, ...cardUsesInfo}
        this.usesLeft.set(this.cardUsesInfo.maxUses)
        this.id = CardInfo.cardsAmount
        CardInfo.cardsAmount += 1

        this.onUse = !this.cardUsesInfo.refreshManually ?
            ()=>{
                this.usesLeft.update(x=>x-1)
                if(this.usesLeft() <= 0) {
                    this.avaliable.set(false)
                    this.turnsForRefreshLeft.set(this.cardUsesInfo.turnsForRefresh)
                }
            } :
            ()=>{
                this.usesLeft.update(x=>x-1)
                if(this.usesLeft() <= 0) {
                    this.avaliable.set(false)
                }
            }

        this.onTurnEnd =  !this.cardUsesInfo.refreshManually ?
            ()=>{
                if(!this.avaliable()) {
                    this.turnsForRefreshLeft.update(x=>x-1)
                    if(this.turnsForRefreshLeft() <= 0) {
                        this.avaliable.set(true)
                    }
                }
            } :
            ()=>{

            }
    }
}