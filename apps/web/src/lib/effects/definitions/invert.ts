import type { EffectDefinition } from "@/types/effects";
import invertFragmentShader from "./invert.frag.glsl";

export const invertEffectDefinition: EffectDefinition = {
	type: "invert",
	name: "Invert",
	keywords: ["invert", "negative", "reverse", "colors"],
	params: [
		{
			key: "intensity",
			label: "Intensity",
			type: "number",
			default: 100,
			min: 0,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: invertFragmentShader,
				uniforms: ({ effectParams }) => {
					return {
						u_intensity: (Number(effectParams.intensity) ?? 100) / 100,
					};
				},
			},
		],
	},
};
