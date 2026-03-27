import type { EffectDefinition } from "@/types/effects";
import pixelateFragmentShader from "./pixelate.frag.glsl";

export const pixelateEffectDefinition: EffectDefinition = {
	type: "pixelate",
	name: "Pixelate",
	keywords: ["pixelate", "mosaic", "blocky", "censor"],
	params: [
		{
			key: "blockSize",
			label: "Block Size",
			type: "number",
			default: 10,
			min: 2,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: pixelateFragmentShader,
				uniforms: ({ effectParams }) => {
					return {
						u_blockSize: Number(effectParams.blockSize) || 10,
					};
				},
			},
		],
	},
};
