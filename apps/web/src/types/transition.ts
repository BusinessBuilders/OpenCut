export interface TransitionData {
  type: string;
  duration: number;
  params: Record<string, number | number[]>;
}

export interface TransitionDefinition {
  type: string;
  name: string;
  category: "basic" | "slide" | "zoom" | "distortion" | "light";
  defaultDuration: number;
  fragmentShader: string;
  defaultParams: Record<string, number | number[]>;
}
