import { computed, Injectable } from "@angular/core";
import { Headquarters } from "../models/headquarters";
import { CurrentLevelService } from "./current-level.service";

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {
    headquarters
    constructor(private currenntLevelService: CurrentLevelService) {
        this.headquarters = new Headquarters(computed(()=>{
            return new Map(currenntLevelService.level.get()?.levelAttributes.get()||[])
        }))
    }
}