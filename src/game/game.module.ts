import { Module } from '@nestjs/common'
import { GameController } from './game.controller'
import { GameService } from './game.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Game } from './entities/game.entity'
import { Genre } from '../genre/entities/genre.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Game, Genre])],
	controllers: [GameController],
	providers: [GameService],
})
export class GameModule {}
