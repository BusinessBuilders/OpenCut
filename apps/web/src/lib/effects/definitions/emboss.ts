import type { EffectDefinition } from "@/types/effects";
import embossFragmentShader from "./emboss.frag.glsl";

export const embossEffectDefinition: EffectDefinition = {
	type: "emboss",
	name: "Emboss",
	keywords: ["emboss", "relief", "texture", "3d"],
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
				fragmentShader: embossFragmentShader,
				uniforms: ({ effectParams }) => {
					return {
						u_intensity: (Number(effectParams.intensity) || 50) / 100,
					};
				},
			},
		],
	},
};
