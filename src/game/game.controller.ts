import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { GameService } from './game.service'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto'
import { ParseIntPipe } from '../common/pipes/parse-int.pipe'
import { CreateGameDto } from './dto/create-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'

@Controller('game')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@Get()
	findAll(@Query() paginationQuery: PaginationQueryDto) {
		return this.gameService.findAll(paginationQuery)
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.gameService.findOne(id)
	}

	@Post()
	create(@Body() createGameDto: CreateGameDto) {
		return this.gameService.create(createGameDto)
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateGameDto: UpdateGameDto,
	) {
		return this.gameService.update(id, updateGameDto)
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.gameService.remove(id)
	}
}
