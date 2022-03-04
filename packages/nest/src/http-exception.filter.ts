import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import BadRequestException from "./exceptions/BadRequestExceptions";
import ResourceNotFoundException from "./exceptions/NotFoundExceptions";

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter<Error> {
  catch(error: Error, host: ArgumentsHost) {
    if (error instanceof BadRequestException || error instanceof ResourceNotFoundException) throw error.toHttpException();

    throw error;
  }
}
