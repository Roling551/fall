import { computed } from "@angular/core";
import { RepeatActionComponent } from "../../feature/repeat-action/repeat-action.component";
import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile/tile";
import { UIData, UIStateService } from "./ui-state.service"
import { createForceSignal } from "../../util/force-signal";
import { BorderComponent } from "../../shared/border/border.component";
import { CurrentLevelService } from "../current-level.service";

export function createRepeatAction<T>(
    uiStateService: UIStateService,
    levelService: CurrentLevelService,
    canSelectTile: (selectedTile: KeyValuePair<Coordinate, Tile>)=>boolean,
    afterFinishAction: (selectedTiles: Map<string, KeyValuePair<Coordinate, Tile>>)=> void,
    cancelButtonAction: ()=>void,
    repeatsNumber: number,
) {
    const selectedTiles = createForceSignal(new Map<string, KeyValuePair<Coordinate, Tile>>())
    const doRenderBorder = (tile:KeyValuePair<Coordinate, Tile>)=>selectedTiles.get().has(tile.key.getKey())
    uiStateService.setUI(
        {
            sideComponent: RepeatActionComponent,
            sideComponentInputs: {
                acceptAction: ()=>{
                    afterFinishAction(selectedTiles.get())
                    uiStateService.cancel()
                },
                repeatsNumber,
                selectedTiles
            },
            tileInfos: new Map([
                [
                    "Selected tiles",
                    {
                    template: BorderComponent,
                    doRender: doRenderBorder,
                    input: {
                        getDirections: (tileInfoIsAbout: KeyValuePair<Coordinate, Tile>)=>{
                                return computed(() => {
                                    const level = levelService.level.get()
                                    if(!level) {
                                        return []
                                    }
                                    return level.map.getDirectionsFunction(doRenderBorder)(tileInfoIsAbout)()
                                })
                            }
                        }
                    }
                ]
            ]),
            mapAction: (tile: KeyValuePair<Coordinate, Tile>) => {
                const tileKey = tile.key.getKey()
                if(selectedTiles.get().has(tileKey)) {
                    selectedTiles.get().delete(tileKey)
                    selectedTiles.forceUpdate()
                }
                else if(canSelectTile(tile)) {
                    selectedTiles.get().set(tileKey, tile)
                    selectedTiles.forceUpdate()
                }
            },
            cancelButtonAction
        }
    )
}