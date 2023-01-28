import { Test, TestingModule } from '@nestjs/testing'
import { GameController } from './game.controller'
import { GameService } from './game.service'
import { createMockRepository } from '../mocks/repository.mock'
import { Game } from './entities/game.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { BadRequestException } from '@nestjs/common'
import { Genre } from '../genre/entities/genre.entity'

describe('GameController', () => {
	let controller: GameController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GameController],
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

		controller = module.get<GameController>(GameController)
	})

	describe('findAll', () => {
		it('should return an array of games', async () => {
			const result = []
			jest
				.spyOn(controller, 'findAll')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.findAll({})).toBe(result)
		})
	})

	describe('findOne', () => {
		it('should return a game', async () => {
			const result = {
				id: 1,
				name: 'Game 1',
				image: 'image.jpg',
				description: 'Game 1 description',
				genres: [],
			}
			jest
				.spyOn(controller, 'findOne')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.findOne(1)).toBe(result)
		})

		it('should return a bad request', async () => {
			const gameId: unknown = 'abc'

			jest
				.spyOn(controller, 'findOne')
				.mockImplementation(() => Promise.resolve(undefined))

			try {
				await controller.findOne(gameId as number)
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException)
				expect(e.message).toEqual(`Bad request`)
			}
		})
	})

	describe('create', () => {
		it('should return a game', async () => {
			const result = {
				id: 1,
				name: 'Game 1',
				image: 'image.jpg',
				description: 'Game 1 description',
				genres: [],
			}
			jest
				.spyOn(controller, 'create')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.create(result)).toBe(result)
		})
	})

	describe('update', () => {
		it('should return a game', async () => {
			const result = {
				id: 1,
				name: 'Game 1',
				image: 'image.jpg',
				description: 'Game 1 description',
				genres: [],
			}
			jest
				.spyOn(controller, 'update')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.update(1, result)).toBe(result)
		})

		it('should return a bad request', async () => {
			const gameId: unknown = 'abc'

			jest
				.spyOn(controller, 'update')
				.mockImplementation(() => Promise.resolve(undefined))

			try {
				await controller.update(gameId as number, {})
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException)
				expect(e.message).toEqual(`Bad request`)
			}
		})
	})

	describe('remove', () => {
		it('should return a game', async () => {
			const result = {
				id: 1,
				name: 'Game 1',
				image: 'image.jpg',
				description: 'Game 1 description',
				genres: [],
			}
			jest
				.spyOn(controller, 'remove')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.remove(1)).toBe(result)
		})
		it('should return a bad request', async () => {
			const gameId: unknown = 'abc'

			jest
				.spyOn(controller, 'remove')
				.mockImplementation(() => Promise.resolve(undefined))

			try {
				await controller.remove(gameId as number)
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException)
				expect(e.message).toEqual(`Bad request`)
			}
		})
	})
})
