import { Injectable } from "@angular/core";
import { createForceSignal } from "../util/force-signal";
import { createTree } from "../models/cell";

@Injectable({
  providedIn: 'root'
})
export class TechnologiesService {
    initialTechnologies = {
        data: 1,
        children: [
            {
                data: 11,
                children: [
                {data: 111},
                {data: 112},
                {data: 113},
                ]
            },
            {data: 12},
            {data: 13},
        ]
    }
    technologies_ = createForceSignal(createTree(this.initialTechnologies))
    technologies = this.technologies_.get
}