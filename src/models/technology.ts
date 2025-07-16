import { signal } from "@angular/core";
import { Building } from "./building"
import { Estate } from "./estate"
import { EstateProductionBonus } from "./bonus";
import { Benefit } from "./benefit";

export class Technology {
    public unlocked = signal(false);
    public avaliable = signal(false);
    constructor(public name: string, public benefits: Benefit[], avaliable=false) {
        this.avaliable.set(avaliable);
    }
}