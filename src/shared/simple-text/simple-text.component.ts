import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-simple-text',
  imports: [],
  templateUrl: './simple-text.component.html',
  styleUrl: './simple-text.component.scss'
})
export class SimpleTextComponent {
  @Input({required: true}) text!: string
}
