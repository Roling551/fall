import { Component, computed } from '@angular/core';
import { LevelsService } from '../../services/levels.service';
import { CurrentWindowService } from '../../services/current-window.service';
import { ShopService } from '../../services/shop.service';
import { TransformTextComponent } from '../../shared/transform-text/transform-text.component';
import { ResourcesService } from '../../services/resources.service';

@Component({
  selector: 'app-shop',
  imports: [TransformTextComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent {
    
    constructor(
        private levelsService: LevelsService, 
        private currentWindowService: CurrentWindowService, 
        private shopService: ShopService,
        private resourcesService: ResourcesService,
    ) {}

    onFinalizingShopping() {
        this.currentWindowService.currentWindow.set("pick-provision")
    }

    currentMoney() {
        return this.resourcesService.getResourceAsTextParts("artifacts")
    }

    possibleUpgradePurchases = computed(() => {
        return this.shopService.possibleUpgradePurchases()
    })
}
