import { StatusCodes } from 'http-status-codes';
import { StatusData } from '../models/statusData';

export class HttpError extends Error {
  protected internalError: Error;

  public constructor(message: string, status: number);
  public constructor(error: Error, status: number, messageOverride?: string);
  public constructor(
    error: string | Error,
    public status: number,
    messageOverride?: string
  ) {
    super();
    if (error instanceof Error) {
      this.message = messageOverride ?? error.message;
      this.internalError = error;
    } else {
      this.message = error;
    }

    // Issue: https://github.com/microsoft/TypeScript/issues/10166
    // Reference: https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BadRequestError extends HttpError {
  public constructor(error: Error) {
    super(error, StatusCodes.BAD_REQUEST);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class CreateRecordError extends BadRequestError {
  public constructor(error: Error, record: StatusData) {
    super({
      name: 'Create record error',
      message: `Failed creating record, record=${record}`,
      stack: error.stack,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CreateRecordError.prototype);
  }
}

export class DuplicateRecordError extends BadRequestError {
  public constructor(error: Error, record: StatusData) {
    super({
      name: 'Duplicate record error',
      message: `Failed saving record because of duplication, record=${record}`,
      stack: error.stack,
    });

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DuplicateRecordError.prototype);
  }
}
