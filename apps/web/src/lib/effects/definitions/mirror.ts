import type { EffectDefinition } from "@/types/effects";
import mirrorFragmentShader from "./mirror.frag.glsl";

export const mirrorEffectDefinition: EffectDefinition = {
	type: "mirror",
	name: "Mirror",
	keywords: ["mirror", "flip", "reflect", "symmetry", "kaleidoscope"],
	params: [
		{
			key: "mode",
			label: "Mode",
			type: "select",
			default: "horizontal",
			options: [
				{ value: "horizontal", label: "Horizontal" },
				{ value: "vertical", label: "Vertical" },
				{ value: "quad", label: "Quad" },
			],
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: mirrorFragmentShader,
				uniforms: ({ effectParams }) => {
					const mode = String(effectParams.mode || "horizontal");
					return {
						u_mode:
							mode === "horizontal" ? 0 : mode === "vertical" ? 1 : 2,
					};
				},
			},
		],
	},
};
