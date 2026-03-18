import { computed, Injectable, Signal } from "@angular/core";
import { TextPart } from "../models/text-part";
import { PlayerStatsService } from "./player-stats.service";
import { ResourcesService } from "./resources.service";

export type UpgradePurchase = {
    price: number,
    describtion: TextPart[],
    canAfford: Signal<boolean>,
    buyAction: ()=>void,
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {

    constructor(private playerStatsService: PlayerStatsService, private resourcesService: ResourcesService) {}

    canAfford(price: number) {
        if(this.resourcesService.canAffordResources(new Map([["artifacts", price]]))) {
            return true
        }
        return false
    }

    spendMoney(price: number) {
        this.resourcesService.spendResources(new Map([["artifacts", price]]))
    }

    possibleUpgradePurchases = computed<UpgradePurchase[]>(() => {
        return [
            {
                price: 10,
                describtion: ["Increase capacity ", this.playerStatsService.provisionCapacity().toString() ,"->", (this.playerStatsService.provisionCapacity()+5).toString()],
                buyAction: ()=>{
                    this.playerStatsService.provisionCapacity.update(x=>x+5)
                }
            },
            {
                price: 100,
                describtion: ["Increase characters drawn per turn", this.playerStatsService.characterCardsDrawnPerTurn().toString() ,"->", (this.playerStatsService.characterCardsDrawnPerTurn()+1).toString()],
                buyAction: ()=>{
                    this.playerStatsService.characterCardsDrawnPerTurn.update(x=>x+1)
                }
            }
        ].map(
            x=>({
                ...x,
                canAfford: computed(()=>this.canAfford(x.price)),
                buyAction: ()=>{
                    this.spendMoney(x.price)
                    x.buyAction()
                }
            })
        )
    })
}