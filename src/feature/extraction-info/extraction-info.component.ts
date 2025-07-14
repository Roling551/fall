import { Component, computed, Input } from '@angular/core';
import { KeyValuePair } from '../../models/key-value-pair';
import { Coordiante } from '../../models/coordinate';
import { Tile } from '../../models/tile';
import { StyleVariablesService } from '../../services/style-variables.service';
import { UIStateService } from '../../services/ui-state/ui-state.service';
import { Extraction } from '../../models/extraction';
import { ExtractionSite, ExtractionSiteItem } from '../../models/extraction-site';

@Component({
  selector: 'app-extraction-info',
  imports: [],
  templateUrl: './extraction-info.component.html',
  styleUrl: './extraction-info.component.scss'
})
export class ExtractionInfoComponent {
  @Input({required: true}) tile!: KeyValuePair<Coordiante, Tile>;

  sizeX
  sizeY
  extraction
  constructor(public styleVariablesService: StyleVariablesService, public uiStateService: UIStateService) {
    this.sizeX = styleVariablesService.sizeX
    this.sizeY = styleVariablesService.sizeY
    this.extraction = uiStateService.tileInfoInput()["extraction"] as Extraction
  }

  extractionAtLocation = computed(()=> {
    return this.extraction.sources.get().get(this.tile.key.getKey())
  })

  onButtonClick(change: number) {
    console.log("Button click");
  }

  getAvaliableExtractionItems = computed(()=> {
    const extractionSite = this.tile.value.mapEntity.get() as ExtractionSite
    const items = new Map<string, ExtractionSiteItem>()
    for(const [name, item] of extractionSite.extractionSiteItems.get()) {
      if(this.extraction.possibleExtractionItems.has(name)) {
        items.set(name, item)
      }
    }
    return items
  })

  getExtractionSiteRates = computed(() => {
    const extractionSite = this.tile.value.mapEntity.get() as ExtractionSite
    return extractionSite.getExtractionRates()
  })

  getExtractorItemRate(item: string) {
    return this.extractionAtLocation()?.get(item) || 0
  }

  getExtractionSiteLeft = computed(()=> {
    const extractionSite = this.tile.value.mapEntity.get() as ExtractionSite
    return extractionSite.getExtractionLeft()
  })
  
  canIncreaseExtraction(item: string) {
    return (this.getExtractionSiteLeft().get(item) || 0) >= 1
  }

  changeExtraction(item: [string, ExtractionSiteItem], change: number) {
    const extractionSite = this.tile.value.mapEntity.get() as ExtractionSite
    extractionSite.addExtractor(this.extraction, computed(()=>{
      return new Map(this.extraction.sources.get().get(this.tile.key.getKey())!)
    }))
    this.extraction.changeExtraction(this.tile.key, item[0], change)
  }
}
