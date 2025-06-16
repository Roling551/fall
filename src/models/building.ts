export class Building {
    constructor(
        public name: string,
        public size: number,
        public produced: Map<string, number>){};
}