type TErrorStatus = 400 | 500 | 404 | 401 | 403 | 409;

export class AppError extends Error {
  status: TErrorStatus;
  errors?: Record<string, string>[];
  constructor(
    message: string,
    status: TErrorStatus,
    errors?: Record<string, string>[]
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
