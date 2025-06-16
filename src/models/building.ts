export class Building {
    constructor(
        public textureName: string,
        public size: number,
        public produced: Map<string, number>){};
}