import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoggingMiddleware } from './middleware/logging.middleware'

@Module({
	providers: [
		// {
		// 	provide: APP_GUARD,
		// 	useClass: ApiKeyGuard,
		// },
		ConfigService,
	],
})
export class CommonModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggingMiddleware).forRoutes('*')
	}
}
