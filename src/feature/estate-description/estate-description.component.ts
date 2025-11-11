import { Component, Input } from '@angular/core';
import { Estate } from '../../models/estate';

@Component({
  selector: 'app-estate-description',
  imports: [],
  templateUrl: './estate-description.component.html',
  styleUrl: './estate-description.component.scss'
})
export class EstateDescriptionComponent {
    @Input({required:true}) estate!: Estate
}
