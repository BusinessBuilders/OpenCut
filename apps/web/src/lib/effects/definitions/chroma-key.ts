import type { EffectDefinition } from "@/types/effects";
import chromaKeyFragmentShader from "./chroma-key.frag.glsl";

function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace("#", "");
	return [
		parseInt(h.substring(0, 2), 16) / 255,
		parseInt(h.substring(2, 4), 16) / 255,
		parseInt(h.substring(4, 6), 16) / 255,
	];
}

export const chromaKeyEffectDefinition: EffectDefinition = {
	type: "chroma-key",
	name: "Chroma Key",
	keywords: ["chroma", "key", "green", "screen", "background", "removal"],
	params: [
		{
			key: "keyColor",
			label: "Key Color",
			type: "color",
			default: "#00ff00",
		},
		{
			key: "similarity",
			label: "Similarity",
			type: "number",
			default: 40,
			min: 0,
			max: 100,
			step: 1,
		},
		{
			key: "smoothness",
			label: "Smoothness",
			type: "number",
			default: 8,
			min: 0,
			max: 100,
			step: 1,
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: chromaKeyFragmentShader,
				uniforms: ({ effectParams }) => {
					const rgb = hexToRgb(String(effectParams.keyColor || "#00ff00"));
					return {
						u_keyColor: rgb,
						u_similarity: (Number(effectParams.similarity) || 40) / 200,
						u_smoothness: (Number(effectParams.smoothness) || 8) / 200,
					};
				},
			},
		],
	},
};
