import { CardInfo } from "./card-info"
import { Resource } from "./resource";
import { Skill } from "./skill";

export class CardOverlayCardInfo extends CardInfo {
    constructor(
        name: string,
        public overlayedCard: CardInfo,
        public skillRequired?: Map<Skill, number>,
        public price?: Map<Resource, number>,
    ) {
        super(name, "CardOverlayCard")
    }
}