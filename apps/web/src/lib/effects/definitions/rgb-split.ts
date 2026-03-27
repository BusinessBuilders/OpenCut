import type { EffectDefinition } from "@/types/effects";
import rgbSplitFragmentShader from "./rgb-split.frag.glsl";

export const rgbSplitEffectDefinition: EffectDefinition = {
	type: "rgb-split",
	name: "RGB Split",
	keywords: ["rgb", "split", "chromatic", "aberration"],
	params: [
		{
			key: "amount",
			label: "Amount",
			type: "number",
			default: 5,
			min: 0,
			max: 50,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: rgbSplitFragmentShader,
				uniforms: ({ effectParams }) => {
					return {
						u_amount: Number(effectParams.amount) || 5,
					};
				},
			},
		],
	},
};
