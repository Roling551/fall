import { Component, computed, Input } from '@angular/core';
import { StyleVariablesService } from '../../services/style-variables.service';

@Component({
  selector: 'app-map-image',
  imports: [],
  templateUrl: './map-image.component.html',
  styleUrl: './map-image.component.scss'
})
export class MapImageComponent {
    @Input({required: true}) input!: any;
    sizeX:number;
    sizeY:number;

    constructor(private styleVariablesService: StyleVariablesService){
        this.sizeX = styleVariablesService.sizeX
        this.sizeY = styleVariablesService.sizeY
    }

    getTexture = computed(()=> {
        return `assets/pictures/${this.input.texture}.png`
    })

    getImgTop = computed(() => {
        return (this.sizeY - this.sizeX) / 2
    })
}
