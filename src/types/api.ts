export default interface ApiErrorResponse {
  error: string;
  message?: string;
  errors?: Array<{
    message: string;
    rule: string;
    field: string;
  }>;
}
