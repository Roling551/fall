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
import { CharacterCardInfoList } from "./character-cards/character-card.list";
import { CharactersCardsService, CharactersCardsServiceMode } from "./character-cards/characters-cards.service";
import { MapImageComponent } from "../shared/map-image/map-image.component";
import { Estate } from "../models/estate";
import { SimpleTile } from "../models/tile/simple-tile";
import { ResourcesService } from "./resources.service";

@Injectable({
  providedIn: 'root'
})
export class InitService {

    constructor(
        private benefitsService: BenefitsService,
        private uiStateService: UIStateService,
        private actionsCardsService: ActionsCardsService,
        private actionCardInfoList: ActionCardInfoList,
        private characterCardInfoList: CharacterCardInfoList,
        private charactersCardsService: CharactersCardsService,
        private decisionsService: DecisionsService,
        private resourcesService: ResourcesService
    ) {}

    init() {
        this.resourcesService.addResources(new Map([["oil",25], ["scrap",25], ["water",25]]))
        this.uiStateService.setBaseTileInfo("resourcesInfo", {
            template: ResourcesInfoComponent,
            doRender: (tile: KeyValuePair<Coordinate, Tile>) => true,
        })
        this.uiStateService.setBaseTileInfo("disabled", {
            template: MapImageComponent,
            input: {
                texture: "forbidden"
            },
            doRender: (tile: KeyValuePair<Coordinate, Tile>) => this.isEntityDisabled(tile),
        })
        // this.benefitsService.initialBenefits.get().set("t1", {
        //     type: "skill-map-action-skill-bonus",
        //     bonus: {
        //         name: "b1",
        //         qualifier: (tile: Tile)=>true,
        //         bonus: (tile: Tile)=>new Map<Skill, number>([["mining",1]])
        //     }
        // })
        const initialCardNames = ["handDrill", "pin", "pin", "needle", "miningTools", "miningTools", "road", "plasticFactory", "powerplant", "danceJack"]
        this.actionsCardsService.setCards(this.actionCardInfoList.getCardsByIdentifiers(initialCardNames))
        const initialCharacterCardNames = ["recycler", "demolisher", "accountant", "miner"]
        this.charactersCardsService.setCards(this.characterCardInfoList.getCardsByNames(initialCharacterCardNames))
    }

    private isEntityDisabled(tile: KeyValuePair<Coordinate, Tile>) {
        if(!(tile.value instanceof SimpleTile)) {
            return false
        }
        const entity = tile.value.playersMapEntity.get()
        if(!entity || !(entity instanceof Estate)) {
            return false
        }
        return entity.disabled()
    }
}