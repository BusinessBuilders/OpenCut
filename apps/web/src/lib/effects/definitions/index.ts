import { hasEffect, registerEffect } from "../registry";
import { blurEffectDefinition } from "./blur";
import { colorAdjustEffectDefinition } from "./color-adjust";
import { vignetteEffectDefinition } from "./vignette";
import { filmGrainEffectDefinition } from "./film-grain";
import { sepiaEffectDefinition } from "./sepia";
import { sharpenEffectDefinition } from "./sharpen";

const defaultEffects = [
	blurEffectDefinition,
	colorAdjustEffectDefinition,
	vignetteEffectDefinition,
	filmGrainEffectDefinition,
	sepiaEffectDefinition,
	sharpenEffectDefinition,
];

export function registerDefaultEffects(): void {
	for (const definition of defaultEffects) {
		if (hasEffect({ effectType: definition.type })) {
			continue;
		}
		registerEffect({ definition });
	}
}
