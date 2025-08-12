import { effect, Injectable, untracked } from "@angular/core";
import { Unit } from "../models/unit";
import { createForceSignal } from "../util/force-signal";
import { UIStateService } from "./ui-state/ui-state.service";

@Injectable({
  providedIn: 'root'
})
export class SelectedUnitsService {  
    public selectedUnitsSignal = createForceSignal(new Set<Unit>())

    public selectUnit(unit: Unit) {
        const selectedUnits = this.selectedUnitsSignal.get()
        if(selectedUnits.has(unit)) {
        selectedUnits.delete(unit)
        } else {
        selectedUnits.add(unit)
        }
        this.selectedUnitsSignal.forceUpdate()
    }

    constructor(private uiStateService: UIStateService) {
        let initialRun = true
        effect(() => {
            const selectedUnits = this.selectedUnitsSignal.get()
            if(!initialRun) {
                if(selectedUnits.size > 0) {
                    untracked(()=> {
                        if(this.uiStateService.uiModeName()==="main") {
                            this.uiStateService.setMapAction_.moveUnits(this.selectedUnitsSignal)
                        } else {
                            this.uiStateService.setMapAction_.moveUnitsBattle(this.selectedUnitsSignal)
                        }
                    })
                } else {
                    untracked(()=>this.uiStateService.setUI(this.uiStateService._ui!))
                }
            }
            initialRun = false
        });
    }
}