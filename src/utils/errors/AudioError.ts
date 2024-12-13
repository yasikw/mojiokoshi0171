export class AudioProcessingError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'AudioProcessingError';
  }
}