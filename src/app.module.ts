import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GenreModule } from './genre/genre.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { CommonModule } from './common/common.module'
import { GameModule } from './game/game.module'
import * as process from 'process'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				type: 'postgres',
				host: process.env.DATABASE_HOST,
				port: +process.env.DATABASE_PORT,
				username: process.env.DATABASE_USER,
				password: process.env.DATABASE_PASSWORD,
				database: process.env.DATABASE_NAME,
				autoLoadEntities: true,
				synchronize: true,
			}),
		}),
		ConfigModule.forRoot(),
		GenreModule,
		CommonModule,
		GameModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
