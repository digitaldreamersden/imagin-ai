import { ModelOption } from '../../types';

export interface GenerationProgress {
  progress: number;
  completed?: number;
  total?: number;
}

export interface StreamMessage {
  type: 'progress' | 'complete';
  progress?: number;
  completed?: number;
  total?: number;
  success?: boolean;
  imageData?: string;
  error?: string;
}

export interface StreamCallbacks {
  onProgress?: (progress: GenerationProgress) => void;
  onComplete?: (imageData: string | null, error: string | null) => void;
}

export interface GenerateImageStreamParams {
  prompt: string;
  model: ModelOption;
  width: number;
  height: number;
}
