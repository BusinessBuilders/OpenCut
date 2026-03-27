export type TextAnimationType =
	| "none"
	| "typewriter"
	| "fade-by-word"
	| "fade-by-letter"
	| "slide-up"
	| "slide-down"
	| "bounce"
	| "wave"
	| "scale-in"
	| "blur-in";

export interface TextAnimationConfig {
	type: TextAnimationType;
	stagger: number; // delay in seconds between each word/letter
	duration: number; // per-unit animation duration in seconds
	easing: string; // e.g. "ease-out", "ease-in-out"
}

export const DEFAULT_TEXT_ANIMATION: TextAnimationConfig = {
	type: "none",
	stagger: 0.05,
	duration: 0.3,
	easing: "ease-out",
};

export const TEXT_ANIMATION_PRESETS: Record<
	string,
	{ name: string; config: TextAnimationConfig }
> = {
	typewriter: {
		name: "Typewriter",
		config: { type: "typewriter", stagger: 0.04, duration: 0.01, easing: "linear" },
	},
	"fade-words": {
		name: "Fade by Word",
		config: { type: "fade-by-word", stagger: 0.08, duration: 0.3, easing: "ease-out" },
	},
	"fade-letters": {
		name: "Fade by Letter",
		config: { type: "fade-by-letter", stagger: 0.03, duration: 0.2, easing: "ease-out" },
	},
	"slide-up": {
		name: "Slide Up",
		config: { type: "slide-up", stagger: 0.06, duration: 0.3, easing: "ease-out" },
	},
	bounce: {
		name: "Bounce",
		config: { type: "bounce", stagger: 0.05, duration: 0.4, easing: "ease-out" },
	},
	wave: {
		name: "Wave",
		config: { type: "wave", stagger: 0.04, duration: 0.5, easing: "ease-in-out" },
	},
	"scale-in": {
		name: "Scale In",
		config: { type: "scale-in", stagger: 0.05, duration: 0.3, easing: "ease-out" },
	},
	"blur-in": {
		name: "Blur In",
		config: { type: "blur-in", stagger: 0.06, duration: 0.3, easing: "ease-out" },
	},
};
