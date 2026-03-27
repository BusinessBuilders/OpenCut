import type { EffectDefinition } from "@/types/effects";
import colorAdjustFragmentShader from "./color-adjust.frag.glsl";

export const colorAdjustEffectDefinition: EffectDefinition = {
	type: "color-adjust",
	name: "Color Adjust",
	keywords: ["color", "brightness", "contrast", "saturation", "temperature", "exposure", "grade"],
	params: [
		{ key: "brightness", label: "Brightness", type: "number", default: 0, min: -100, max: 100, step: 1 },
		{ key: "contrast", label: "Contrast", type: "number", default: 0, min: -100, max: 100, step: 1 },
		{ key: "saturation", label: "Saturation", type: "number", default: 0, min: -100, max: 100, step: 1 },
		{ key: "temperature", label: "Temperature", type: "number", default: 0, min: -100, max: 100, step: 1 },
		{ key: "exposure", label: "Exposure", type: "number", default: 0, min: -200, max: 200, step: 1 },
	],
	renderer: {
		type: "webgl",
		passes: [{
			fragmentShader: colorAdjustFragmentShader,
			uniforms: ({ effectParams }) => ({
				u_brightness: (Number(effectParams.brightness) || 0) / 100,
				u_contrast: (Number(effectParams.contrast) || 0) / 100,
				u_saturation: (Number(effectParams.saturation) || 0) / 100,
				u_temperature: (Number(effectParams.temperature) || 0) / 100,
				u_exposure: (Number(effectParams.exposure) || 0) / 100,
			}),
		}],
	},
};
