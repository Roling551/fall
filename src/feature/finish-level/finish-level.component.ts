import { Component, computed } from '@angular/core';
import { LevelsService } from '../../services/levels.service';
import { CurrentWindowService } from '../../services/current-window.service';
import { LevelGoalsService } from '../../services/level-goals.service';
import { LevelGoal } from '../../models/level-goals';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';

@Component({
  selector: 'app-finish-level',
  imports: [TransformTextComponent],
  templateUrl: './finish-level.component.html',
  styleUrl: './finish-level.component.scss'
})
export class FinishLevelComponent {
    constructor(private levelsService: LevelsService, private currentWindowService: CurrentWindowService, private levelGoalsService: LevelGoalsService) {}

    onCancel(): void {
        this.currentWindowService.currentWindow.set("world-map")
    }
    onNextLevel(): void {
        this.levelsService.nextLevel()
        this.currentWindowService.currentWindow.set("world-map")
    }
    canNextLevel(): boolean {
        return this.levelGoalsService.goalsCheckedNumber() >= this.levelGoalsService.goalsInfo().goalsRequired
    }
    goalsNumberText = computed(()=>{
        return this.levelGoalsService.goalsCheckedNumber() + "/" + this.levelGoalsService.goalsInfo().goalsRequired
    })
    goals = computed(()=>{
        return this.levelGoalsService.goals.get().map(x=>({
            text: [...x.getDescription(), ": ", ...x.getStatus()],
            isChecked: x.isChecked,
            check: (event: MouseEvent)=> {
                event.preventDefault()
                x.check()
            },
            isMet: x.isMet
        }))
    })
}
