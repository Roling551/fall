import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accept-action',
  imports: [],
  templateUrl: './accept-action.component.html',
  styleUrl: './accept-action.component.scss'
})
export class AcceptActionComponent {
    @Input({required: true}) acceptAction!: ()=> void
    onAcceptClick(){
        this.acceptAction()
    }
}
