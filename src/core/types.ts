export interface ArrowAnnotation {
  type: "arrow";
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color?: string;
}

export interface TextAnnotation {
  type: "text";
  x: number;
  y: number;
  text: string;
  color?: string;
  fontSize?: number;
}

export interface BoxAnnotation {
  type: "box";
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

export type Annotation = ArrowAnnotation | TextAnnotation | BoxAnnotation;

export interface AnnotateConfig {
  input: string;
  output: string;
  annotations: Annotation[];
}
