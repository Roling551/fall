export class Extraction {
    constructor(public strength: number) {}
    
    static addFunctional(bonus1: Extraction, bonus2: Extraction) {
        return new Extraction(bonus1.strength + bonus2.strength)
    }

    getText() {
        return this.strength.toString()
    }
}