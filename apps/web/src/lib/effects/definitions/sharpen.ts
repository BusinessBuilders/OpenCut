import type { EffectDefinition } from "@/types/effects";
import sharpenFragmentShader from "./sharpen.frag.glsl";

export const sharpenEffectDefinition: EffectDefinition = {
	type: "sharpen",
	name: "Sharpen",
	keywords: ["sharpen", "crisp", "detail", "clarity"],
	params: [
		{ key: "intensity", label: "Intensity", type: "number", default: 30, min: 0, max: 100, step: 1 },
	],
	renderer: {
		type: "webgl",
		passes: [{
			fragmentShader: sharpenFragmentShader,
			uniforms: ({ effectParams }) => ({
				u_intensity: (Number(effectParams.intensity) || 30) / 100 * 0.5,
			}),
		}],
	},
};
