export interface ApiError {
  status: number;
  code?: string;
  message: string;
  fieldErrors?: Record<string, string[]>;
  detail?: unknown;
}

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly fieldErrors?: Record<string, string[]>;

  constructor(status: number, message: string, options?: { code?: string; fieldErrors?: Record<string, string[]> }) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = options?.code;
    this.fieldErrors = options?.fieldErrors;
  }

  toApiError(): ApiError {
    return {
      status: this.status,
      code: this.code,
      message: this.message,
      fieldErrors: this.fieldErrors,
    };
  }
}
