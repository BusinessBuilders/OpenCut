import type { EffectDefinition } from "@/types/effects";
import letterboxFragmentShader from "./letterbox.frag.glsl";

function hexToRgb(hex: string): [number, number, number] {
	const h = hex.replace("#", "");
	return [
		parseInt(h.substring(0, 2), 16) / 255,
		parseInt(h.substring(2, 4), 16) / 255,
		parseInt(h.substring(4, 6), 16) / 255,
	];
}

export const letterboxEffectDefinition: EffectDefinition = {
	type: "letterbox",
	name: "Letterbox",
	keywords: ["letterbox", "cinematic", "bars", "widescreen"],
	params: [
		{
			key: "amount",
			label: "Amount",
			type: "number",
			default: 12,
			min: 0,
			max: 30,
			step: 1,
		},
		{
			key: "barColor",
			label: "Bar Color",
			type: "color",
			default: "#000000",
		},
	],
	renderer: {
		type: "webgl",
		passes: [
			{
				fragmentShader: letterboxFragmentShader,
				uniforms: ({ effectParams }) => {
					const amount =
						typeof effectParams.amount === "number"
							? effectParams.amount
							: Number.parseFloat(String(effectParams.amount));
					const rgb = hexToRgb(String(effectParams.barColor || "#000000"));
					return {
						u_amount: amount / 100,
						u_barColor: rgb,
					};
				},
			},
		],
	},
};
