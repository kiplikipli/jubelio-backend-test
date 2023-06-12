import { EStatusCode } from '../enum/status-code.enum';

export class NotFoundError extends Error {
  public message;
  public statusCode;

  constructor(msg = 'not found') {
    super();
    this.message = msg;
    this.statusCode = EStatusCode.NOT_FOUND;
  }
}
