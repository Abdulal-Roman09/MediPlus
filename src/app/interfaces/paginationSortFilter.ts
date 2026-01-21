export type IGenericResponse<T> = {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: T;
};
