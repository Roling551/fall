import { ActionsListComponent } from "../../feature/actions-list/actions-list.component";
import { BattleInfoPanelComponent } from "../../feature/battle-info-panel/battle-info-panel.component";
import { GameInfoPanelComponent } from "../../feature/game-info-panel/game-info-panel.component";
import { UIModeSettings } from "./ui-state.service";

export function getMainMode(): UIModeSettings {
    return {
        headerComponent: GameInfoPanelComponent,
        defaultSideComponent: ActionsListComponent
    }
}

export function getBattleMode(): UIModeSettings {
    return {
        headerComponent: BattleInfoPanelComponent
    }
}