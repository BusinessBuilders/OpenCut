import type { EffectDefinition } from "@/types/effects";
import posterizeFragmentShader from "./posterize.frag.glsl";

export const posterizeEffectDefinition: EffectDefinition = {
	type: "posterize",
	name: "Posterize",
	keywords: ["posterize", "reduce", "colors", "flat"],
	params: [
		{
			key: "levels",
			label: "Levels",
			type: "number",
			default: 6,
			min: 2,
			max: 20,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: posterizeFragmentShader,
				uniforms: ({ effectParams }) => {
					return {
						u_levels: Number(effectParams.levels) || 6,
					};
				},
			},
		],
	},
};
