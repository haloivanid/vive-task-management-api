import { ErrorDto } from './error.dto';

export class ResponseDto<T = null> {
  request_id: string;
  success: boolean;
  data: T;
  error: ErrorDto | null;
}
