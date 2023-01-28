import { Injectable, NotFoundException } from '@nestjs/common'
import { Game } from './entities/game.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateGameDto } from './dto/create-game.dto'
import { Genre } from '../genre/entities/genre.entity'
import { PaginationQueryDto } from '../common/dto/pagination-query.dto'
import { UpdateGameDto } from './dto/update-game.dto'

@Injectable()
export class GameService {
	constructor(
		@InjectRepository(Game) private readonly gameRepository: Repository<Game>,
		@InjectRepository(Genre)
		private readonly genreRepository: Repository<Genre>,
	) {}

	findAll(paginationQuery: PaginationQueryDto) {
		const { limit, offset } = paginationQuery
		return this.gameRepository.find({
			relations: ['genres'],
			skip: offset,
			take: limit,
		})
	}

	async findOne(id: number) {
		const game = await this.gameRepository.findOne({
			where: { id },
			relations: ['genres'],
		})
		if (!game) throw new NotFoundException(`Game #${id} not found`)
		return game
	}

	async create(createGameDto: CreateGameDto) {
		const genres = await Promise.all(
			createGameDto.genres.map(name => this.preloadGenreByName(name)),
		)
		const game = this.gameRepository.create({
			...createGameDto,
			genres,
		})
		return this.gameRepository.save(game)
	}

	async update(id: number, updateGameDto: UpdateGameDto) {
		const genres =
			updateGameDto.genres &&
			(await Promise.all(
				updateGameDto.genres.map(name => this.preloadGenreByName(name)),
			))
		const game = await this.gameRepository.preload({
			id,
			...updateGameDto,
			genres,
		})
		if (!game) throw new NotFoundException(`Game #${id} not found`)
		return this.gameRepository.save(game)
	}

	async remove(id: number) {
		const game = await this.gameRepository.findOne({
			where: { id },
			relations: ['genres'],
		})
		if (!game) throw new NotFoundException(`Game #${id} not found`)
		return this.gameRepository.remove(game)
	}

	async preloadGenreByName(name: string) {
		const existingGenre = await this.genreRepository.findOne({
			where: { name },
		})

		if (existingGenre) return existingGenre
		return this.genreRepository.create({ name })
	}
}
