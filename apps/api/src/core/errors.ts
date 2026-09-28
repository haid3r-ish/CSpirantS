export class AppError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') { super(404, message); }
}
export class BadRequestError extends AppError {
  constructor(message: string) { super(400, message); }
}
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') { super(401, message); }
}
export class ConflictError extends AppError {
  constructor(message: string) { super(409, message); }
}

/**
 * Wraps a promise and automatically maps any rejected error into a custom AppError.
 * Keeps controllers clean from boilerplate try/catch blocks.
 */
export async function wrapError<T>(promise: Promise<T>, errorToThrow: Error): Promise<T> {
  try {
    return await promise;
  } catch (err: unknown) {
    throw errorToThrow;
  }
}

