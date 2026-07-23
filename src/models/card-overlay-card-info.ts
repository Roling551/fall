import { CardInfo } from "./card-info"
import { Resource } from "./resource";

export class CardOverlayCardInfo extends CardInfo {
    constructor(
        name: string,
        public overlayedCard: CardInfo,
        public price?: Map<Resource, number>,
    ) {
        super(name, "CardOverlayCard")
    }
}