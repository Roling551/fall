import { signal } from "@angular/core";
import { Building } from "./building"
import { Estate } from "./estate"
import { EstateProductionBonus } from "./bonus";
import { Benefit } from "./benefit";

export interface TechnologySettings {
    width?: number,
    avaliable?: boolean
}

const defaultTechnologySettings: TechnologySettings = {
    width: 1,
    avaliable: false
}

export class Technology {
    public discovered = signal(false);
    public avaliable = signal(false);
    constructor(public name: string, public benefits: Map<string,Benefit>, public settings?: TechnologySettings) {
        this.settings = !!settings ? {...defaultTechnologySettings, ...settings} : defaultTechnologySettings
        this.avaliable.set(this.settings!.avaliable!);
    }
}