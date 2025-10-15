import { Injectable, Signal } from "@angular/core";
import { BenefitsService } from "./benefits.service";
import { createForceSignal } from "../util/force-signal";
import { Benefit } from "../models/benefit";
import { UIStateService } from "./ui-state/ui-state.service";
import { ResourcesInfoComponent } from "../feature/resources-info/resources-info.component";
import { Coordinate } from "../models/coordinate";
import { Tile } from "../models/tile/tile";
import { KeyValuePair } from "../models/key-value-pair";
import { Skill } from "../models/skill";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";
import { DecisionFactoryService } from "./decision-factory.service";
import { DecisionsService } from "./decisions.service";

@Injectable({
  providedIn: 'root'
})
export class InitService {

    constructor(
        private benefitsService: BenefitsService,
        private uiStateService: UIStateService,
        private actionsCardsService: ActionsCardsService,
        private actionCardInfoList: ActionCardInfoList,
        private decisionFactoryService: DecisionFactoryService,
        private decisionsService: DecisionsService,
    ) {}

    init() {
        this.uiStateService.setBaseTileInfo("resourcesInfo", {
            template: ResourcesInfoComponent,
            doRender: (tile: KeyValuePair<Coordinate, Tile>) => true,
        })
        // this.benefitsService.initialBenefits.get().set("t1", {
        //     type: "skill-map-action-skill-bonus",
        //     bonus: {
        //         name: "b1",
        //         qualifier: (tile: Tile)=>true,
        //         bonus: (tile: Tile)=>new Map<Skill, number>([["mining",1]])
        //     }
        // })
        const initialCardNames = ["handDrill", "automaticDrill", "miningTools", "road"]
        const initialCards = initialCardNames.map(x=>this.actionCardInfoList.list.get(x)).filter(x=>!!x).map(x=>x())
        this.actionsCardsService.setCards(initialCards)

        this.decisionsService.addDecision(
            this.decisionFactoryService.createDecision([
                {type: "Card", cardName: "handDrill"},
                {type: "Card", cardName: "automaticDrill"},
                {type: "Resources", resources: new Map([["oil", 10]])}
            ])
        )
            
    }
}