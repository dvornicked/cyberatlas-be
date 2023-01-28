import { Injectable, NotFoundException } from '@nestjs/common'
import { Genre } from './entities/genre.entity'
import { CreateGenreDto } from './dto/create-genre.dto'
import { UpdateGenreDto } from './dto/update-genre.dto'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto'

@Injectable()
export class GenreService {
	constructor(
		@InjectRepository(Genre)
		private readonly genreRepository: Repository<Genre>,
	) {}

	findAll(paginationQuery: PaginationQueryDto) {
		const { limit, offset } = paginationQuery
		return this.genreRepository.find({
			take: limit,
			skip: offset,
		})
	}

	async findOne(id: number) {
		const genre = await this.genreRepository.findOne({
			where: { id },
		})
		if (!genre) throw new NotFoundException(`Genre #${id} not found`)
		return genre
	}

	create(createGenreDto: CreateGenreDto) {
		const genre = this.genreRepository.create(createGenreDto)
		return this.genreRepository.save(genre)
	}

	async update(id: number, updateGenreDto: UpdateGenreDto) {
		const genre = await this.genreRepository.preload({
			id,
			...updateGenreDto,
		})
		if (!genre) throw new NotFoundException(`Genre #${id} not found`)
		return this.genreRepository.save(genre)
	}

	async remove(id: number) {
		const genre = await this.findOne(id)
		if (!genre) throw new NotFoundException(`Genre #${id} not found`)
		return this.genreRepository.remove(genre)
	}
}
