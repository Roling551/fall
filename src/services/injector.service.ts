import { Injectable, Injector } from "@angular/core";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";
import { ResourcesService } from "./resources.service";

@Injectable({
  providedIn: 'root'
})
export class InjectorService {
    constructor(private injector:Injector) {}

    actionsCardsService?: ActionsCardsService
    actionCardInfoList?: ActionCardInfoList

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
}