import { Coordinate } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile";
import { UIData, UIStateService } from "./ui-state.service";

export function createMultiStageAction(
    uiStateService: UIStateService,
    stateActions: ((tile: KeyValuePair<Coordinate, Tile>)=>boolean)[],
    cancelButtonAction: ()=>void,
    afterFinishAction: ()=> void,
    uis?: UIData[])
{
    const actions: ((tile: KeyValuePair<Coordinate, Tile>) => void)[] = new Array(stateActions.length)
    const newUIs: UIData[] = new Array(stateActions.length)
    
    actions[stateActions.length-1] = (tile: KeyValuePair<Coordinate, Tile>) => {
        if(stateActions[stateActions.length-1](tile)) {
            afterFinishAction()
            uiStateService.cancel()
        }
    }
    for(let i = stateActions.length-2; i>=0; i--) {
        newUIs[i] = {
            ...(uis?.[i+1] || {}),
            mapAction: actions[i+1],
            cancelButtonAction
        }
        actions[i] = (tile: KeyValuePair<Coordinate, Tile>) => {
            if(stateActions[i](tile)) {
                uiStateService.setUI(newUIs[i], {skipBack: true, cantIterrupt: true, cantInterruptException: [newUIs[i+1]]})
            }
        }
    }
    const uiChanged = uiStateService.setUI(
        {
            ...(uis?.[0] || {}),
            mapAction:actions[0], 
            cancelButtonAction 
        },{
            cantIterrupt: true, override:true, cantInterruptException: [newUIs[0]]
        }
    )
    return uiChanged
}