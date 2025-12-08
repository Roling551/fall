import { Injectable, Injector } from "@angular/core";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";
import { ResourcesService } from "./resources.service";
import { RewardFactoryService } from "./reward-factory.service";
import { DecisionFactoryService } from "./decision-factory.service";
import { DecisionsService } from "./decisions.service";
import { CharactersCardsService } from "./character-cards/characters-cards.service";

@Injectable({
  providedIn: 'root'
})
export class InjectorService {
    constructor(private injector:Injector) {}

    actionsCardsService?: ActionsCardsService
    actionCardInfoList?: ActionCardInfoList
    rewardFactoryService?: RewardFactoryService
    decisionFactoryService?: DecisionFactoryService
    decisionsService?: DecisionsService
    charactersCardsService?: CharactersCardsService

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

    public getDecisionFactoryService() {
        if(!this.decisionFactoryService) {
            this.decisionFactoryService = this.injector.get(DecisionFactoryService)
        }
        return this.decisionFactoryService
    }

    public getDecisionsService() {
        if(!this.decisionsService) {
            this.decisionsService = this.injector.get(DecisionsService)
        }
        return this.decisionsService
    }

    public getCharactersCardsService() {
        if(!this.charactersCardsService) {
            this.charactersCardsService = this.injector.get(CharactersCardsService)
        }
        return this.charactersCardsService
    }

}