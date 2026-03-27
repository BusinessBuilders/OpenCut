import type { EffectDefinition } from "@/types/effects";
import glitchFragmentShader from "./glitch.frag.glsl";

export const glitchEffectDefinition: EffectDefinition = {
	type: "glitch",
	name: "Glitch",
	keywords: ["glitch", "digital", "distortion", "broken"],
	params: [
		{
			key: "intensity",
			label: "Intensity",
			type: "number",
			default: 50,
			min: 0,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: glitchFragmentShader,
				uniforms: ({ effectParams }) => {
					return {
						u_intensity: (Number(effectParams.intensity) || 50) / 100,
						u_seed: Math.random() * 1000,
					};
				},
			},
		],
	},
};
