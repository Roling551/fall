import { TileInfo } from "../services/ui-state/ui-state.service";
import { SkillMapActionSkillBonus } from "./bonus";
import { CardInfo } from "./card-info";
import { CardOnHandBenefits } from "./card-on-hand-benefit";
import { Coordinate } from "./coordinate";
import { KeyValuePair } from "./key-value-pair";
import { Skill } from "./skill";
import { Tile } from "./tile/tile";

export interface CardCreationStep {
    action: ((tile: KeyValuePair<Coordinate, Tile>)=>boolean);
    tileInfos?: Map<string,TileInfo>
}

export class ActionCardInfo extends CardInfo {
    constructor(
        name: string,
        public requiredSkills: Map<Skill, number>,
        public cardCreationSteps: CardCreationStep[],
        public price?: Map<string, number>,
        public cardOnHandBenefits?: CardOnHandBenefits,
    ) {
        super(name)
    }
}