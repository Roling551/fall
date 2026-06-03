import { Injectable } from "@angular/core";
import { CharacterCardInfo } from "../../models/character-card-info";
import { ObstacleType } from "../../models/obstacles";
import { Skill } from "../../models/skill";
import { CardsActionsService } from "../cards-actions.service";
import { CardOperationInput, CardsOperationsService } from "../cards-operations.service";

export type CharacterCardInput = {
    name: string,
    skills: Map<Skill, number>,
    characterAction: CardOperationInput,
    movementAdvantege?: Map<ObstacleType, number>,
    cardPicture?: string,
}

@Injectable({
  providedIn: 'root'
})
export class CharacterCardInfoFactoryService {
    constructor(private cardsOperationsService: CardsOperationsService) {}

    createCharacterCard(input: CharacterCardInput) {
        const {actionInfo, actionDescription} = this.cardsOperationsService.getActionInfoAndDescription(input.characterAction)
        const card = new CharacterCardInfo(
            input.name,
            input.skills,
            actionInfo,
            actionDescription,
            input.movementAdvantege,
            input.cardPicture
        )
        return card
    }
}