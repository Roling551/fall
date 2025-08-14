import { Coordiante } from "./coordinate";
import { KeyValuePair } from "./key-value-pair";
import { Tile } from "./tile";

export class CardInfo {
    constructor(
        public name: string, 
        public actions: ((tile: KeyValuePair<Coordiante, Tile>)=>void)[],
    ){}
}