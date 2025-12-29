import { Component, Input } from '@angular/core';
import { Estate } from '../../models/estate';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';

@Component({
  selector: 'app-estate-description',
  imports: [TransformTextComponent],
  templateUrl: './estate-description.component.html',
  styleUrl: './estate-description.component.scss'
})
export class EstateDescriptionComponent {
    @Input({required:true}) estate!: Estate
    getTexture() {
        return `assets/pictures/${(this.estate.picture||this.estate.name)}.png`
    }
}
