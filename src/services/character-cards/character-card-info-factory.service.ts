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
    movementAdvantege?: Map<ObstacleType, number>
}

@Injectable({
  providedIn: 'root'
})
export class CharacterCardInfoFactoryService {
    constructor(private charactersActionsService: CharactersActionsService) {}

    createCharacterCard(input: CharacterCardInput) {
        const card = new CharacterCardInfo(
            input.name,
            input.skills,
            input.movement,
            this.charactersActionsService.getCharacterActionInfo(input.characterAction),
            input.movementAdvantege
        )
        return card
    }
}