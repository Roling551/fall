import { FactoryCardInputs } from "../services/action-cards/action-card-creation-info-factory.service";
import { TileInfo } from "../services/ui-state/ui-state.service";
import { SkillMapActionSkillBonus } from "./bonus";
import { CardInfo } from "./card-info";
import { Coordinate } from "./coordinate";
import { KeyValuePair } from "./key-value-pair";
import { Resource } from "./resource";
import { Reward } from "./reward";
import { Skill } from "./skill";
import { Tile } from "./tile/tile";

export interface CardCreationStep {
    action: ((tile: KeyValuePair<Coordinate, Tile>)=>boolean);
    tileInfos?: Map<string,TileInfo>
}

export class ActionCardInfo extends CardInfo {
    constructor(
        name: string,
        public removeOnUse: boolean,
        public requiredSkills: Map<Skill, number>,
        public cardCreationSteps: CardCreationStep[],
        public additionalInfo: FactoryCardInputs,
        public effectsDescriptions: string[],
        public price?: Map<Resource, number>,
        public cardOnHandRewards?: Reward[],
    ) {
        super(name)
    }
}