import { createOffscreenCanvas } from "@/services/renderer/canvas-utils";
import {
	compileShader,
	setUniforms,
	drawFullscreenQuad,
} from "@/services/renderer/webgl-utils";

const TRANSITION_VERT = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

let gl: WebGLRenderingContext | null = null;
let canvas: OffscreenCanvas | HTMLCanvasElement | null = null;
const programCache = new Map<string, WebGLProgram>();

function getOrCreateCanvas({
	width,
	height,
}: {
	width: number;
	height: number;
}): OffscreenCanvas | HTMLCanvasElement {
	if (!canvas) {
		canvas = createOffscreenCanvas({ width, height });
		gl = canvas.getContext("webgl", {
			premultipliedAlpha: false,
		}) as WebGLRenderingContext | null;
		if (!gl) {
			throw new Error("WebGL not supported for transitions");
		}
	}
	if (canvas.width !== width || canvas.height !== height) {
		canvas.width = width;
		canvas.height = height;
	}
	return canvas;
}

function compileTransitionProgram({
	context,
	fragmentShaderSource,
}: {
	context: WebGLRenderingContext;
	fragmentShaderSource: string;
}): WebGLProgram {
	const cached = programCache.get(fragmentShaderSource);
	if (cached) return cached;

	const vertexShader = compileShader({
		context,
		source: TRANSITION_VERT,
		type: context.VERTEX_SHADER,
	});
	const fragmentShader = compileShader({
		context,
		source: fragmentShaderSource,
		type: context.FRAGMENT_SHADER,
	});
	const program = context.createProgram();
	if (!program) throw new Error("Failed to create transition WebGL program");
	context.attachShader(program, vertexShader);
	context.attachShader(program, fragmentShader);
	context.linkProgram(program);
	if (!context.getProgramParameter(program, context.LINK_STATUS)) {
		const info = context.getProgramInfoLog(program);
		context.deleteProgram(program);
		throw new Error(`Transition program link failed: ${info}`);
	}
	context.deleteShader(vertexShader);
	context.deleteShader(fragmentShader);
	programCache.set(fragmentShaderSource, program);
	return program;
}

function createTextureFromSource({
	context,
	source,
	textureUnit,
}: {
	context: WebGLRenderingContext;
	source: CanvasImageSource;
	textureUnit: number;
}): WebGLTexture {
	const texture = context.createTexture();
	if (!texture) throw new Error("Failed to create texture");
	context.activeTexture(context.TEXTURE0 + textureUnit);
	context.bindTexture(context.TEXTURE_2D, texture);
	context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1);
	context.texParameteri(
		context.TEXTURE_2D,
		context.TEXTURE_WRAP_S,
		context.CLAMP_TO_EDGE,
	);
	context.texParameteri(
		context.TEXTURE_2D,
		context.TEXTURE_WRAP_T,
		context.CLAMP_TO_EDGE,
	);
	context.texParameteri(
		context.TEXTURE_2D,
		context.TEXTURE_MIN_FILTER,
		context.LINEAR,
	);
	context.texParameteri(
		context.TEXTURE_2D,
		context.TEXTURE_MAG_FILTER,
		context.LINEAR,
	);
	context.texImage2D(
		context.TEXTURE_2D,
		0,
		context.RGBA,
		context.RGBA,
		context.UNSIGNED_BYTE,
		source as TexImageSource,
	);
	return texture;
}

export function renderTransition({
	fromSource,
	toSource,
	width,
	height,
	progress,
	fragmentShader,
	params,
}: {
	fromSource: CanvasImageSource;
	toSource: CanvasImageSource;
	width: number;
	height: number;
	progress: number;
	fragmentShader: string;
	params: Record<string, number | number[]>;
}): OffscreenCanvas | HTMLCanvasElement {
	const targetCanvas = getOrCreateCanvas({ width, height });
	const context = gl;
	if (!context) throw new Error("WebGL context not initialized for transitions");

	const program = compileTransitionProgram({
		context,
		fragmentShaderSource: fragmentShader,
	});

	context.bindFramebuffer(context.FRAMEBUFFER, null);
	// biome-ignore lint/correctness/useHookAtTopLevel: WebGL API method
	context.useProgram(program);

	const fromTexture = createTextureFromSource({
		context,
		source: fromSource,
		textureUnit: 0,
	});
	const toTexture = createTextureFromSource({
		context,
		source: toSource,
		textureUnit: 1,
	});

	const uFromLoc = context.getUniformLocation(program, "u_from");
	const uToLoc = context.getUniformLocation(program, "u_to");
	if (uFromLoc) context.uniform1i(uFromLoc, 0);
	if (uToLoc) context.uniform1i(uToLoc, 1);

	setUniforms({
		context,
		program,
		uniforms: {
			u_progress: progress,
			u_resolution: [width, height],
			...params,
		},
	});

	drawFullscreenQuad({ context, program, width, height });

	context.deleteTexture(fromTexture);
	context.deleteTexture(toTexture);
	context.bindTexture(context.TEXTURE_2D, null);

	const outputCanvas = createOffscreenCanvas({ width, height });
	const outputCtx = outputCanvas.getContext("2d") as
		| CanvasRenderingContext2D
		| OffscreenCanvasRenderingContext2D
		| null;
	if (outputCtx) {
		outputCtx.drawImage(targetCanvas, 0, 0, width, height);
	}
	return outputCanvas;
}
