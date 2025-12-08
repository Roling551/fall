import { Injectable, Signal } from "@angular/core";
import { BenefitsService } from "./benefits.service";
import { UIStateService } from "./ui-state/ui-state.service";
import { ResourcesInfoComponent } from "../feature/resources-info/resources-info.component";
import { Coordinate } from "../models/coordinate";
import { Tile } from "../models/tile/tile";
import { KeyValuePair } from "../models/key-value-pair";
import { ActionsCardsService } from "./action-cards/actions-cards.service";
import { ActionCardInfoList } from "./action-cards/action-card-info.list";
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
        const initialCardNames = ["handDrill", "automaticDrill", "automaticDrill", "miningTools", "road"]
        this.actionsCardsService.setCards(this.actionCardInfoList.getCardsByNames(initialCardNames))
    }
}