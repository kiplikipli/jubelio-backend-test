import { ResponseToolkit } from '@hapi/hapi';
import { NotFoundError } from '../errors/not-found.error';
import { EStatusCode } from '../enum/status-code.enum';
import { constructResponse } from '.';
import { BadRequestError } from '../errors/bad-request.error';

export const errorHandler = (error: unknown, h: ResponseToolkit) => {
  let customStatusCode: EStatusCode = EStatusCode.INTERNAL_SERVER_ERROR;
  let errors: string[] = [];
  if (error instanceof NotFoundError || error instanceof BadRequestError) {
    customStatusCode = error.statusCode;
  }

  if (error instanceof BadRequestError) {
    errors = error.errors ? error.errors : [];
  }

  const castedError = error as Error;

  const { statusCode, ...response } = constructResponse(
    false,
    false,
    undefined,
    customStatusCode,
    castedError.message,
    errors
  );

  return h.response(response).code(statusCode);
};
