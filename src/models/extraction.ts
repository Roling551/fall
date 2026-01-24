export class Extraction {
    constructor(public strength: number) {}

    addBonus(bonus: ExtractionBonus) {
        return new Extraction(this.strength + bonus.strength)
    }
}

export class ExtractionBonus {
    constructor(public strength: number) {}
    static addFunctional(bonus1: ExtractionBonus, bonus2: ExtractionBonus) {
        return new ExtractionBonus(bonus1.strength + bonus2.strength)
    }
    getText() {
        return this.strength.toString()
    }
}