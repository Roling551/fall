import { Injectable } from "@angular/core";
import { CharacterCardInfo } from "../../models/character-card-info";
import { ObstacleType } from "../../models/obstacles";
import { Skill } from "../../models/skill";
import { CharacterActionInput, CharactersActionsService } from "./characters-actions.service";

export type CharacterCardInput = {
    name: string,
    skills: Map<Skill, number>, 
    movement: number, 
    characterAction: CharacterActionInput,
    movementAdvantege?: Map<ObstacleType, number>,
    cardPicture?: string,
}

@Injectable({
  providedIn: 'root'
})
export class CharacterCardInfoFactoryService {
    constructor(private charactersActionsService: CharactersActionsService) {}

    createCharacterCard(input: CharacterCardInput) {
        const {actionInfo, actionDescription} = this.charactersActionsService.getCharacterActionInfoAndDescription(input.characterAction)
        const card = new CharacterCardInfo(
            input.name,
            input.skills,
            input.movement,
            actionInfo,
            actionDescription,
            input.movementAdvantege,
            input.cardPicture
        )
        return card
    }
}