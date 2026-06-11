import { FactoryCardInputs } from "../services/action-cards/action-card-info-factory.service";
import { CardsActionInfo } from "../services/cards-actions.service";
import { TileInfo } from "../services/ui-state/ui-state.service";
import { CardInfo } from "./card-info";
import { Coordinate } from "./coordinate";
import { KeyValuePair } from "./key-value-pair";
import { Resource } from "./resource";
import { Reward } from "./reward";
import { Skill } from "./skill";
import { TextPart } from "./text-part";
import { Tile } from "./tile/tile";

export interface CardCreationStep {
    action: ((tile: KeyValuePair<Coordinate, Tile>)=>boolean);
    tileInfos?: Map<string,TileInfo>;
    onStepStart?: ()=>void;
}

export class ActionCardInfo extends CardInfo {
    constructor(
        name: string,
        public action: CardsActionInfo,
        public removeOnUse: boolean,
        public requiredSkills: Map<Skill, number>,
        public additionalInfo: FactoryCardInputs,
        public effectsDescriptions: TextPart[][],
        public maxDistance: number,
        public cardPicture?: string,
        public price?: Map<Resource, number>,
        public cardOnHandRewards?: Reward[],
        public actionRepeatNumber?: number,
    ) {
        super(name, "ActionCard")
    }
}