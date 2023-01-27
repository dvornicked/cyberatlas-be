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
import { GenreService } from './genre.service'
import { CreateGenreDto } from './dto/create-genre.dto'
import { UpdateGenreDto } from './dto/update-genre.dto'
import { PaginationQueryDto } from './dto/pagination-query.dto'
import { ParseIntPipe } from '../common/pipes/parse-int.pipe'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('genre')
@Controller('genre')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get()
	findAll(@Query() paginationQuery: PaginationQueryDto) {
		return this.genreService.findAll(paginationQuery)
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.genreService.findOne(id)
	}

	@Post()
	create(@Body() createGenreDto: CreateGenreDto) {
		return this.genreService.create(createGenreDto)
	}

	@Patch(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateGenreDto: UpdateGenreDto,
	) {
		return this.genreService.update(id, updateGenreDto)
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.genreService.remove(id)
	}
}
