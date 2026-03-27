import { hasEffect, registerEffect } from "../registry";
import { blurEffectDefinition } from "./blur";
import { colorAdjustEffectDefinition } from "./color-adjust";
import { vignetteEffectDefinition } from "./vignette";
import { filmGrainEffectDefinition } from "./film-grain";
import { sepiaEffectDefinition } from "./sepia";
import { sharpenEffectDefinition } from "./sharpen";
import { chromaKeyEffectDefinition } from "./chroma-key";
import { glitchEffectDefinition } from "./glitch";
import { pixelateEffectDefinition } from "./pixelate";
import { rgbSplitEffectDefinition } from "./rgb-split";
import { posterizeEffectDefinition } from "./posterize";
import { invertEffectDefinition } from "./invert";
import { embossEffectDefinition } from "./emboss";
import { vhsEffectDefinition } from "./vhs";
import { mirrorEffectDefinition } from "./mirror";
import { letterboxEffectDefinition } from "./letterbox";

const defaultEffects = [
	blurEffectDefinition,
	colorAdjustEffectDefinition,
	vignetteEffectDefinition,
	filmGrainEffectDefinition,
	sepiaEffectDefinition,
	sharpenEffectDefinition,
	chromaKeyEffectDefinition,
	glitchEffectDefinition,
	pixelateEffectDefinition,
	rgbSplitEffectDefinition,
	posterizeEffectDefinition,
	invertEffectDefinition,
	embossEffectDefinition,
	vhsEffectDefinition,
	mirrorEffectDefinition,
	letterboxEffectDefinition,
];

export function registerDefaultEffects(): void {
	for (const definition of defaultEffects) {
		if (hasEffect({ effectType: definition.type })) {
			continue;
		}
		registerEffect({ definition });
	}
}
