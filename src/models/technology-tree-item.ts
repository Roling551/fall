import { computed, Signal } from "@angular/core";
import { Technology } from "./technology";

export interface TechnologyTreeItem {
    type: "technology"
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
    }
    return undefined
}