import { computed, signal } from "@angular/core";

export class OneTimeJob {
    workUnitsDone = signal(0)
    workUniPerTurn = signal(0)
    constructor(public name: string, public workUnitsNeeded: number, private jobDoneAction: ()=>void) {}

    workUnitsLeft = computed(()=>{
        return this.workUnitsNeeded - this.workUnitsDone()
    })

    jobDone() {
        this.jobDoneAction()
    }

    work(): boolean {
        this.workUnitsDone.update(x=>x+this.workUniPerTurn())
        if(this.workUnitsLeft() <= 0) {
            this.jobDone()
            return true
        }
        return false
    }

    changeWorkUniPerTurn(change: number) {
        this.workUniPerTurn.update(x=>Math.max(0, Math.min(x+change, this.workUnitsLeft())));
    }

    produced = computed<Map<string, number>>(()=>{
        return new Map([["workers-need", this.workUniPerTurn()]])
    })
}