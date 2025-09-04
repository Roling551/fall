import { ChangeDetectionStrategy, Component, computed, Input, input, OnChanges, signal, Signal, SimpleChanges } from '@angular/core';
import { StyleVariablesService } from '../../services/style-variables.service';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordinate } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { TileDirection } from '../../models/tile-direction';
import { CommonModule } from '@angular/common';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { createForceSignal } from '../../util/force-signal';

@Component({
  selector: 'app-border',
  imports: [CommonModule],
  templateUrl: './border.component.html',
  styleUrl: './border.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BorderComponent implements OnChanges {
  @Input({required: true}) tile!: KeyValuePair<Coordinate, Tile>;
  @Input({required: true}) input!: any;
  getDirections?: (tileInfoIsAbout: KeyValuePair<Coordinate, Tile>) => Signal<TileDirection[]>

  directions? : Signal<TileDirection[]>

  sizeX
  sizeY
  constructor(public styleVariablesService: StyleVariablesService) {
    this.sizeX = styleVariablesService.sizeX
    this.sizeY = styleVariablesService.sizeY
    console.log("Border component created")
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getDirections = this.input["getDirections"]
    this.directions = this.getDirections!(this.tile!)!
  }

  getImgTop() {
    return (this.sizeY - this.sizeX) / 2
  }

  getTexture(name: TileDirection): string {
    console.log(name)
    switch(name) {
      case 'yPlus': return this.getTexture_('bottom-left-border')
      case 'yMinus': return this.getTexture_('top-right-border')
      case 'xPlus': return this.getTexture_('bottom-right-border')
      case 'xMinus': return this.getTexture_('top-left-border')
    }
  }

  getTexture_(name: string): string {
    return `assets/pictures/${name}.png`
  }
}
