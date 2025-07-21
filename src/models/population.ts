import { computed, signal } from "@angular/core"
import { City } from "./city"

export class Population {

    readonly percentageChange = 0.2
    amount
    cumulationOfChange = 0

    change = computed(() => {
        return Math.min(this.amount() * this.percentageChange, this.changeBasedOnFood())
    })

    changeBasedOnFood = computed(() => {
        return this.percentageChange*(this.city.produced().get("food")!-this.city.produced().get("food-need")!)
    })

    nextTurn() {
        this.cumulationOfChange += this.change()
        this.amount.update(x=>x+Math.floor(this.cumulationOfChange))
        this.cumulationOfChange -= Math.floor(this.cumulationOfChange)
    }

    produced = computed(()=>{
        return new Map<string, number>([["food-need",this.amount()]])
    })

    constructor(initialAmount: number, private city: City) {
        this.amount = signal(initialAmount)
    }


}