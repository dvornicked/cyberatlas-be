import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
	implements ExceptionFilter
{
	catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()

		const status = exception.getStatus()
		const exceptionResponse = exception.getResponse()
		const error =
			typeof exceptionResponse === 'string'
				? { message: exceptionResponse }
				: exceptionResponse

		response.status(status).json({
			timestamp: new Date().toISOString(),
			...error,
		})
	}
}
