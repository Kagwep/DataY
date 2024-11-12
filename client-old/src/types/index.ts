// types.ts
export type FieldType = 'text' | 'textarea' | 'number' | 'radio' | 'checkbox' | 'select' | 'imageFile';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options?: string[];
  accept?: string; // For file inputs
}

export interface FormStructure {
  title: string;
  description: string;
  fields: FormField[];
}

export interface NewField extends Omit<FormField, 'id'> {
  options: string[];
}

export interface FormResponse {
    formId: string;
    responses: {
      [fieldId: string]: string | string[] | number;
    };
    submittedAt: string;
  }
  

  // types.ts
export type Tool = 'pointer' | 'rectangle' | 'circle' | 'freehand' | 'label';

export interface Point {
  x: number;
  y: number;
}

export interface BaseAnnotation {
  type: string;
  color: string;
}

export interface RectangleAnnotation extends BaseAnnotation {
  type: 'rectangle';
  startX: number;
  startY: number;
  width: number;
  height: number;
}

export interface CircleAnnotation extends BaseAnnotation {
  type: 'circle';
  centerX: number;
  centerY: number;
  radius: number;
}

export interface FreehandAnnotation extends BaseAnnotation {
  type: 'freehand';
  points: Point[];
}

export interface LabelAnnotation extends BaseAnnotation {
  type: 'label';
  text: string;
  x: number;
  y: number;
}

export type Annotation = RectangleAnnotation | CircleAnnotation | FreehandAnnotation | LabelAnnotation;

export interface ToolInfo {
  id: Tool;
  icon: React.FC<{ className?: string }>;
  name: string;
}

export interface LabelPosition {
  x: number;
  y: number;
}