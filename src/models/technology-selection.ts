import { signal } from "@angular/core";
import { Technology } from "./technology";

export class TechnologySelection {
    public avaliable = signal(false);
    constructor(public name: string, public technologies: Set<Technology>){}
}