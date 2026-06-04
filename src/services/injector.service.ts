import { Injectable, Injector } from "@angular/core";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";
import { ResourcesService } from "./resources.service";
import { RewardFactoryService } from "./reward-factory.service";
import { DecisionsService } from "./decisions.service";
import { TurnActorsService } from "./turn-actors.service";

@Injectable({
  providedIn: 'root'
})
export class InjectorService {
    constructor(private injector:Injector) {}

    actionsCardsService?: ActionsCardsService
    actionCardInfoList?: ActionCardInfoList
    rewardFactoryService?: RewardFactoryService
    decisionsService?: DecisionsService
    resourcesService?: ResourcesService
    turnActorsService?: TurnActorsService

    public getActionsCardsService() {
        if(!this.actionsCardsService) {
            this.actionsCardsService = this.injector.get(ActionsCardsService)
        }
        return this.actionsCardsService
    }

    public getActionCardInfoList() {
        if(!this.actionCardInfoList) {
            this.actionCardInfoList = this.injector.get(ActionCardInfoList)
        }
        return this.actionCardInfoList
    }

    public getRewardFactoryService() {
        if(!this.rewardFactoryService) {
            this.rewardFactoryService = this.injector.get(RewardFactoryService)
        }
        return this.rewardFactoryService
    }
    public getDecisionsService() {
        if(!this.decisionsService) {
            this.decisionsService = this.injector.get(DecisionsService)
        }
        return this.decisionsService
    }

    public getResourcesService() {
        if(!this.resourcesService) {
            this.resourcesService = this.injector.get(ResourcesService)
        }
        return this.resourcesService
    }

    public getTurnActorsService() {
        if(!this.turnActorsService) {
            this.turnActorsService = this.injector.get(TurnActorsService)
        }
        return this.turnActorsService
    }
}