import { ApiResponseProperty } from '@nestjs/swagger';

export class ApiResponseMessage {
  @ApiResponseProperty()
  status: number;

  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  data?: object;
}

export class ErrorResponse {
  @ApiResponseProperty()
  statusCode: number;

  @ApiResponseProperty()
  message: string;

  @ApiResponseProperty()
  error: string;
}
