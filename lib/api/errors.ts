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
  public readonly backendData?: unknown;

  constructor(status: number, message: string, options?: { code?: string; fieldErrors?: Record<string, string[]>; backendData?: unknown }) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = options?.code;
    this.fieldErrors = options?.fieldErrors;
    this.backendData = options?.backendData;
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
