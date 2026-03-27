import type { EffectDefinition } from "@/types/effects";
import vignetteFragmentShader from "./vignette.frag.glsl";

export const vignetteEffectDefinition: EffectDefinition = {
	type: "vignette",
	name: "Vignette",
	keywords: ["vignette", "darkened", "edges", "cinematic"],
	params: [
		{ key: "intensity", label: "Intensity", type: "number", default: 50, min: 0, max: 100, step: 1 },
		{ key: "radius", label: "Radius", type: "number", default: 70, min: 20, max: 100, step: 1 },
	],
	renderer: {
		type: "webgl",
		passes: [{
			fragmentShader: vignetteFragmentShader,
			uniforms: ({ effectParams }) => ({
				u_intensity: (Number(effectParams.intensity) || 50) / 100,
				u_radius: (Number(effectParams.radius) || 70) / 100,
			}),
		}],
	},
};
