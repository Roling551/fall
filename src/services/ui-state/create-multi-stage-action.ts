import { Coordiante } from "../../models/coordinate";
import { KeyValuePair } from "../../models/key-value-pair";
import { Tile } from "../../models/tile";
import { UIData, UIStateService } from "./ui-state.service";

export function createMultiStageAction(
    uiStateService: UIStateService,
    stateActions: ((tile: KeyValuePair<Coordiante, Tile>)=>boolean)[],
    cancelButtonAction: ()=>void,
    afterFinishAction: ()=> void)
{
    const actions: ((tile: KeyValuePair<Coordiante, Tile>) => void)[] = new Array(stateActions.length)
    const uis: UIData[] = new Array(stateActions.length)
    
    actions[stateActions.length-1] = (tile: KeyValuePair<Coordiante, Tile>) => {
        if(stateActions[stateActions.length-1](tile)) {
            afterFinishAction()
            uiStateService.cancel()
        }
    }
    for(let i = stateActions.length-2; i>=0; i--) {
        uis[i] = {
        mapAction: actions[i+1],
        cancelButtonAction
        }
        actions[i] = (tile: KeyValuePair<Coordiante, Tile>) => {
            if(stateActions[i](tile)) {
                uiStateService.setUI(uis[i], {skipBack: true, cantIterrupt: true, cantInterruptException: [uis[i+1]]})
            }
        }
    }
    const uiChanged = uiStateService.setUI(
        {
            mapAction:actions[0], 
            cancelButtonAction 
        },{
            cantIterrupt: true, override:true, cantInterruptException: [uis[0]]
        }
    )
    return uiChanged
}