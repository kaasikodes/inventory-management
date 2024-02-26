import { TPaginationData } from "./generic";

export class AppJSONResponse<T> {
  data?: T | null;
  message: string;
  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
  }
}

export class AppJSONResponseWithPagination<T> {
  data?: TPaginationData<T> | null;
  message: string;
  constructor(message: string, data?: TPaginationData<T> | null) {
    this.message = message;
    this.data = data;
  }
}
