import { Component, input } from '@angular/core';
import { OneTimeJob } from '../../models/one-time-job';

@Component({
  selector: 'app-one-time-job-panel',
  imports: [],
  templateUrl: './one-time-job-panel.component.html',
  styleUrl: './one-time-job-panel.component.scss'
})
export class OneTimeJobPanelComponent {
  oneTimeJob = input.required<OneTimeJob>()
  
  changeWorkersAmount(change: number) {
    this.oneTimeJob().changeWorkUniPerTurn(change);
  }

  getJobStatus(): string {
    return `${this.oneTimeJob().workUnitsDone()} (+${this.oneTimeJob().workUniPerTurn()}) / ${this.oneTimeJob().workUnitsNeeded}`
  }
}
