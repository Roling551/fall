import { Injectable } from "@angular/core";
import { ActionCardCreationInfoFactoryService } from "./action-card-creation-info-factory.service";
import { CardCreationInfo } from "./actions-cards.service";

@Injectable({
  providedIn: 'root'
})
export class ActionCardInfoList {
    constructor(private factory: ActionCardCreationInfoFactoryService) {}

    list = new Map<string, ()=>CardCreationInfo>([
        [
            "handDrill",
            ()=>this.factory.instantExtractionCard()
        ]
    ])
}