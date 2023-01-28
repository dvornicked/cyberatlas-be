import { Test, TestingModule } from '@nestjs/testing'
import { GameService } from './game.service'
import { createMockRepository, MockRepository } from '../mocks/repository.mock'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Game } from './entities/game.entity'
import { NotFoundException } from '@nestjs/common'
import { Genre } from '../genre/entities/genre.entity'
import { CreateGameDto } from './dto/create-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'

describe('GameService', () => {
	let service: GameService
	let gameRepository: MockRepository
	let genreRepository: MockRepository

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GameService,
				{
					provide: getRepositoryToken(Game),
					useValue: createMockRepository<Game>(),
				},
				{
					provide: getRepositoryToken(Genre),
					useValue: createMockRepository<Genre>(),
				},
			],
		}).compile()

		service = module.get<GameService>(GameService)
		gameRepository = module.get(getRepositoryToken(Game))
		genreRepository = module.get(getRepositoryToken(Genre))
	})

	describe('findAll', () => {
		it('should return an array of games', async () => {
			const expectedGames = []
			gameRepository.find.mockResolvedValue(expectedGames)

			const games = await service.findAll({})

			expect(games).toEqual(expectedGames)
		})
	})

	describe('findOne', () => {
		it('should return a game when game with ID exists', async () => {
			const gameId = 1
			const expectedGame = {}
			gameRepository.findOne.mockResolvedValue(expectedGame)

			const game = await service.findOne(gameId)

			expect(game).toEqual(expectedGame)
		})

		it('should throw an error when game with ID does not exist', async () => {
			const gameId = 1
			gameRepository.findOne.mockResolvedValue(undefined)

			try {
				await service.findOne(gameId)
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException)
				expect(e.message).toEqual(`Game #${gameId} not found`)
			}
		})
	})

	describe('create', () => {
		it('should create a game without provided genres', async () => {
			const createGameDto: CreateGameDto = {
				name: 'Game 1',
				description: 'Game 1 description',
				image: 'image.jpg',
				genres: [],
			}
			const expectedGame = { ...createGameDto, genres: [] }
			gameRepository.create.mockReturnValue(expectedGame)
			gameRepository.save.mockResolvedValue(expectedGame)

			const game = await service.create(createGameDto)

			expect(gameRepository.save).toBeCalledWith(expectedGame)
			expect(game).toEqual(expectedGame)
		})

		it('should create a game with created and provided genres', async () => {
			const createGameDto: CreateGameDto = {
				name: 'Game 1',
				description: 'Game 1 description',
				image: 'image.jpg',
				genres: ['Genre 1'],
			}
			const expectedGenre = { name: 'Genre 1' }
			const expectedGame = { ...createGameDto, genres: [expectedGenre] }

			genreRepository.findOne.mockResolvedValue(expectedGenre)
			gameRepository.create.mockReturnValue(expectedGame)
			gameRepository.save.mockResolvedValue(expectedGame)

			const game = await service.create(createGameDto)

			expect(genreRepository.findOne).toBeCalledWith({
				where: { name: createGameDto.genres[0] },
			})
			expect(gameRepository.save).toBeCalledWith(expectedGame)
			expect(game).toEqual(expectedGame)
		})

		it('should create a game with provided genres but not created yet', async () => {
			const createGameDto: CreateGameDto = {
				name: 'Game 1',
				description: 'Game 1 description',
				image: 'image.jpg',
				genres: ['Genre 1'],
			}
			const expectedGenre = { name: 'Genre 1' }
			const expectedGame = { ...createGameDto, genres: [expectedGenre] }
			genreRepository.findOne.mockResolvedValue(undefined)
			genreRepository.create.mockReturnValue(expectedGenre)
			gameRepository.create.mockReturnValue(expectedGame)
			gameRepository.save.mockResolvedValue(expectedGame)

			const game = await service.create(createGameDto)

			expect(genreRepository.findOne).toBeCalledWith({
				where: { name: createGameDto.genres[0] },
			})
			expect(genreRepository.create).toBeCalledWith({
				name: createGameDto.genres[0],
			})
			expect(gameRepository.save).toBeCalledWith(expectedGame)
			expect(game).toEqual(expectedGame)
		})
	})

	describe('update', () => {
		it('should update a game without provided genres', async () => {
			const gameId = 1
			const updateGameDto: UpdateGameDto = {
				name: 'Game 1',
				description: 'Game 1 description',
				image: 'image.jpg',
				genres: [],
			}
			const expectedGame = { id: gameId, ...updateGameDto, genres: [] }
			gameRepository.preload.mockResolvedValue(expectedGame)
			gameRepository.save.mockResolvedValue(expectedGame)

			const game = await service.update(gameId, updateGameDto)

			expect(gameRepository.preload).toBeCalledWith(expectedGame)
			expect(gameRepository.save).toBeCalledWith(expectedGame)
			expect(game).toEqual(expectedGame)
		})

		it('should update a game with created and provided genres', async () => {
			const gameId = 1
			const updateGameDto: UpdateGameDto = {
				name: 'Game 1',
				description: 'Game 1 description',
				image: 'image.jpg',
				genres: ['Genre 1'],
			}
			const expectedGenre = { name: 'Genre 1' }
			const expectedGame = {
				id: gameId,
				...updateGameDto,
				genres: [expectedGenre],
			}
			genreRepository.findOne.mockResolvedValue(expectedGenre)
			gameRepository.preload.mockResolvedValue(expectedGame)
			gameRepository.save.mockResolvedValue(expectedGame)

			const game = await service.update(gameId, updateGameDto)

			expect(genreRepository.findOne).toBeCalledWith({
				where: { name: updateGameDto.genres[0] },
			})
			expect(gameRepository.preload).toBeCalledWith(expectedGame)
			expect(gameRepository.save).toBeCalledWith(expectedGame)
			expect(game).toEqual(expectedGame)
		})

		it('should update a game with provided genres but not created yet', async () => {
			const gameId = 1
			const updateGameDto: UpdateGameDto = {
				name: 'Game 1',
				description: 'Game 1 description',
				image: 'image.jpg',
				genres: ['Genre 1'],
			}
			const expectedGenre = { name: 'Genre 1' }
			const expectedGame = {
				id: gameId,
				...updateGameDto,
				genres: [expectedGenre],
			}
			genreRepository.findOne.mockResolvedValue(undefined)
			genreRepository.create.mockReturnValue(expectedGenre)
			gameRepository.preload.mockResolvedValue(expectedGame)
			gameRepository.save.mockResolvedValue(expectedGame)

			const game = await service.update(gameId, updateGameDto)

			expect(genreRepository.findOne).toBeCalledWith({
				where: { name: updateGameDto.genres[0] },
			})
			expect(genreRepository.create).toBeCalledWith({
				name: updateGameDto.genres[0],
			})
			expect(gameRepository.preload).toBeCalledWith(expectedGame)
			expect(gameRepository.save).toBeCalledWith(expectedGame)
			expect(game).toEqual(expectedGame)
		})

		it('should throw an error when game with ID does not exist', async () => {
			const gameId = 1
			const updateGameDto: UpdateGameDto = {
				name: 'Game 1',
				description: 'Game 1 description',
				image: 'image.jpg',
				genres: [],
			}
			gameRepository.preload.mockResolvedValue(undefined)

			try {
				await service.update(gameId, updateGameDto)
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException)
			}
		})
	})

	describe('remove', () => {
		it('should remove a game', async () => {
			const gameId = 1
			const expectedGenres = [{ name: 'Genre 1' }]
			const expectedGame = { genres: expectedGenres }
			gameRepository.findOne.mockResolvedValue(expectedGame)
			gameRepository.remove.mockResolvedValue(expectedGame)

			const game = await service.remove(gameId)

			expect(gameRepository.findOne).toBeCalledWith({
				where: { id: gameId },
				relations: ['genres'],
			})
			expect(gameRepository.remove).toBeCalledWith(expectedGame)
			expect(game).toEqual(expectedGame)
		})

		it('should throw an error when game with ID does not exist', async () => {
			const gameId = 1
			gameRepository.findOne.mockResolvedValue(undefined)

			try {
				await service.remove(gameId)
			} catch (e) {
				expect(e).toBeInstanceOf(NotFoundException)
				expect(e.message).toEqual(`Game #${gameId} not found`)
			}
		})
	})
})
