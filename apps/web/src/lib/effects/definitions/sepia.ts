import type { EffectDefinition } from "@/types/effects";
import sepiaFragmentShader from "./sepia.frag.glsl";

export const sepiaEffectDefinition: EffectDefinition = {
	type: "sepia",
	name: "Sepia",
	keywords: ["sepia", "warm", "vintage", "old", "brown"],
	params: [
		{ key: "intensity", label: "Intensity", type: "number", default: 80, min: 0, max: 100, step: 1 },
	],
	renderer: {
		type: "webgl",
		passes: [{
			fragmentShader: sepiaFragmentShader,
			uniforms: ({ effectParams }) => ({
				u_intensity: (Number(effectParams.intensity) || 80) / 100,
			}),
		}],
	},
};
