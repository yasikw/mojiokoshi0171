export class ModelInitializationError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'ModelInitializationError';
  }
}