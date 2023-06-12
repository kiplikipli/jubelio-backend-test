import { EStatusCode } from '../enum/status-code.enum';

export class BadRequestError extends Error {
  public message;
  public statusCode;
  public errors?: string[];

  constructor(msg = 'bad request', errors?: string[]) {
    super();
    this.message = msg;
    this.statusCode = EStatusCode.BAD_REQUEST;
    this.errors = errors;
  }
}
