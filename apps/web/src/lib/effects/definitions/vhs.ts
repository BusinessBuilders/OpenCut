import type { EffectDefinition } from "@/types/effects";
import vhsFragmentShader from "./vhs.frag.glsl";

export const vhsEffectDefinition: EffectDefinition = {
	type: "vhs",
	name: "VHS",
	keywords: ["vhs", "retro", "tape", "analog", "vintage", "80s"],
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
				fragmentShader: vhsFragmentShader,
				uniforms: ({ effectParams }) => {
					const intensity =
						typeof effectParams.intensity === "number"
							? effectParams.intensity
							: Number.parseFloat(String(effectParams.intensity));
					return {
						u_intensity: intensity / 100,
						u_seed: Math.random() * 1000,
					};
				},
			},
		],
	},
};
