import { computed } from "@angular/core";
import { ForceSignal } from "../util/force-signal";
import { LimitedSet } from "../util/limited-set";
import { multiplyNumericalValues, multiplyNumericalValuesFunctional } from "../util/map-functions";
import { Building } from "./building";
import { MapEntity, MapEntityType, SkillActionResult } from "./map-entity";
import { Resource, resourcesToTextParts } from "./resource";
import { Reward } from "./reward";
import { SimpleActee } from "./simple-actee";
import { TextPart } from "./text-part";
import { Actee } from "./actee";
import { Extraction } from "./extraction";

export type ExtractableModifications = "hardness" | "fragility"

export function extractableModificationsToTextPart(extractableModifications: Map<ExtractableModifications, number>): TextPart[] {
    return [...extractableModifications.entries()].flatMap(x=>[x[1].toString(),{type:"emoticon",emoticon:x[0]}," "])
}

export type ExtractableSettings = {
    maxProgress: number, 
    modifications?: Map<ExtractableModifications, number>
}

export class EnvironmentMapEntity extends MapEntity {
    readonly type = "environment";
    actee?: SimpleActee

    public extractableModifications?: Map<ExtractableModifications, number>

    constructor(
        name: string, 
        public extractableSettings?: ExtractableSettings, 
        public resourcesGain?: Map<Resource, number>, 
        private onDepletedRewardsGetter?: ()=>Reward[],
        private onStepRewardWithChance?: {chance: number, rewards: ()=>Reward[]}[]
    ) {
        super(name);
        if(extractableSettings) {
            this.actee = new SimpleActee(extractableSettings)
            this.extractableModifications = extractableSettings.modifications
        }
    }

    gainOnStepRewards() {
        for(const rewardsWithChance of this.onStepRewardWithChance!) {
            if(Math.random() < rewardsWithChance.chance) {
                for(const reward of rewardsWithChance.rewards()) {
                    reward.claim()
                }
            }
        }
    }

    override extractionAction(extraction: Extraction): SkillActionResult {
        if(!this.actee) {
            return {}
        }
        const actionResult = this.actee.extractionAction(extraction)
        if(this.onDepletedRewardsGetter && actionResult.justFinished) {
            this.onDepletedRewardsGetter().forEach(x=>x.claim())
        }
        if(this.onSelfDestroy && actionResult.justFinished) {
            this.onSelfDestroy()
        }
        const effectiveProgress = this.calculateEffectiveProgressDone(actionResult.progressDone, extraction)
        if(this.onStepRewardWithChance) {
            for(let i = 0; i<effectiveProgress; i++) {
                this.gainOnStepRewards()
            }
        }
        return {
            ...(this.resourcesGain && {resourcesGained: multiplyNumericalValuesFunctional(this.resourcesGain, effectiveProgress)})
        }
    }

    private calculateEffectiveProgressDone(progressDone: number, extraction: Extraction): number {
        return Math.max(0, progressDone - Math.max(0, (this.extractableModifications?.get("fragility")||0) - (extraction.modifications.get("precission")||0)) - (extraction.modifications.get("waste")||0))
    }

    override canAttemptExtractionAction(extraction: Extraction): boolean {
        return !!this.actee && this.actee.canAttemptExtractionAction(extraction)
    }

    getDescription = computed<TextPart[]>(() => {
        if(!this.actee) {
            return []
        }
        let textParts:TextPart[] =  []
        if(this.resourcesGain) {
            textParts = textParts.concat(
                resourcesToTextParts(multiplyNumericalValuesFunctional(this.resourcesGain, this.actee.progressLeft()))
            )
        } else {
            textParts = textParts.concat(this.actee.progressLeft() + "/" + this.actee.maxProgress)
        }
        if(this.extractableModifications) {
            textParts = textParts.concat("(")
            textParts = textParts.concat(extractableModificationsToTextPart(this.extractableModifications))
            textParts = textParts.concat(")")
        }
        return textParts
    })
}