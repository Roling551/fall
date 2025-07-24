import { computed, Signal } from "@angular/core";
import { Technology } from "./technology";
import { TechnologySelection } from "./technology-selection";

export interface TechnologyTreeItem {
    type: "technology" | "technology-selection"
    name: string
    width: number
    item: any
    avaliable: Signal<boolean>
    makeAvaliable: () => void

}

export function getTechnologyTreeItem(item: any): TechnologyTreeItem | undefined {
    if(item instanceof Technology) {
        return {
            type: "technology",
            name: item.name,
            width: 1,
            item,
            avaliable: computed( ()=> item.avaliable()),
            makeAvaliable: () => item.avaliable.set(true),
        }
    } else if(item instanceof TechnologySelection) {
        return {
            type: "technology-selection",
            name: item.name,
            width: item.technologies.size,
            item,
            avaliable: computed( ()=> item.avaliable()),
            makeAvaliable: () => item.avaliable.set(true),
        }
    }
    return undefined
}