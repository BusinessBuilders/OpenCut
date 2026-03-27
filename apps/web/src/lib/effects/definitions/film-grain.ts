import type { EffectDefinition } from "@/types/effects";
import filmGrainFragmentShader from "./film-grain.frag.glsl";

export const filmGrainEffectDefinition: EffectDefinition = {
	type: "film-grain",
	name: "Film Grain",
	keywords: ["grain", "noise", "film", "analog", "vintage"],
	params: [
		{ key: "intensity", label: "Intensity", type: "number", default: 15, min: 0, max: 100, step: 1 },
	],
	renderer: {
		type: "webgl",
		passes: [{
			fragmentShader: filmGrainFragmentShader,
			uniforms: ({ effectParams }) => ({
				u_intensity: (Number(effectParams.intensity) || 15) / 100 * 0.15,
				u_seed: Math.random() * 1000,
			}),
		}],
	},
};
