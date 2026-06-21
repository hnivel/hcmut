export class ErrorResponse {
  readonly statusCode: number;
  readonly message: string;
  readonly error: string;
  readonly timestamp: string;

  constructor(statusCode: number, message: string, error: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }
}
