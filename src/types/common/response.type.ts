export type TResponse<T = any> = {
  globalSuccess: boolean;
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  errors?: string[];
};
