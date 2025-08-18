import { Coordiante } from "./coordinate";
import { KeyValuePair } from "./key-value-pair";
import { Tile } from "./tile";

export class CardInfo {
    static cardsAmount = 0
    id: number = 0
    constructor(
        public name: string, 
        public onSelect?: (()=>boolean),
    ){
        this.id = CardInfo.cardsAmount
        CardInfo.cardsAmount += 1
    }
}