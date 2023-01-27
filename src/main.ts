import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalFilters(new HttpExceptionFilter())
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			forbidNonWhitelisted: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	)
	const config = new DocumentBuilder().setTitle('NestJS API').build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)
	await app.listen(3000)
}

bootstrap()
