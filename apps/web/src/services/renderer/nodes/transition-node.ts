import { CanvasRenderer } from "../canvas-renderer";
import { BaseNode } from "./base-node";
import { renderTransition } from "@/lib/transitions/renderer";
import { getTransition } from "@/lib/transitions";
import type { TransitionData } from "@/types/transition";

const CROSSFADE_SHADER = `
  precision mediump float;
  uniform sampler2D u_from;
  uniform sampler2D u_to;
  uniform float u_progress;
  varying vec2 v_texCoord;
  void main() {
    gl_FragColor = mix(texture2D(u_from, v_texCoord), texture2D(u_to, v_texCoord), u_progress);
  }
`;

interface TransitionNodeParams {
  transitionData: TransitionData;
  overlapStart: number;
  overlapEnd: number;
  outgoingNode: BaseNode;
  incomingNode: BaseNode;
}

export class TransitionNode extends BaseNode<TransitionNodeParams> {
  async render({
    renderer,
    time,
  }: {
    renderer: CanvasRenderer;
    time: number;
  }): Promise<void> {
    const {
      transitionData,
      overlapStart,
      overlapEnd,
      outgoingNode,
      incomingNode,
    } = this.params;

    // Before overlap: render outgoing only
    if (time < overlapStart) {
      await outgoingNode.render({ renderer, time });
      return;
    }

    // After overlap: render incoming only
    if (time >= overlapEnd) {
      await incomingNode.render({ renderer, time });
      return;
    }

    // During overlap: blend both through transition shader
    const duration = overlapEnd - overlapStart;
    const progress =
      duration > 0 ? (time - overlapStart) / duration : 0;

    // Render each element to its own offscreen renderer
    const fromRenderer = new CanvasRenderer({
      width: renderer.width,
      height: renderer.height,
      fps: renderer.fps,
    });
    const toRenderer = new CanvasRenderer({
      width: renderer.width,
      height: renderer.height,
      fps: renderer.fps,
    });

    await outgoingNode.render({ renderer: fromRenderer, time });
    await incomingNode.render({ renderer: toRenderer, time });

    // Resolve transition shader + params
    let fragmentShader: string;
    let params: Record<string, number | number[]>;
    try {
      const definition = getTransition({ transitionType: transitionData.type });
      fragmentShader = definition.fragmentShader;
      params = { ...definition.defaultParams, ...transitionData.params };
    } catch {
      fragmentShader = CROSSFADE_SHADER;
      params = {};
    }

    const result = renderTransition({
      fromSource: fromRenderer.canvas,
      toSource: toRenderer.canvas,
      width: renderer.width,
      height: renderer.height,
      progress: Math.max(0, Math.min(1, progress)),
      fragmentShader,
      params,
    });

    renderer.context.drawImage(result, 0, 0, renderer.width, renderer.height);
  }
}
