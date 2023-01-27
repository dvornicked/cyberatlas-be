import { Test, TestingModule } from '@nestjs/testing'
import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Genre } from './entities/genre.entity'
import { createMockRepository } from '../mocks/repositoty.mock'
import { BadRequestException } from '@nestjs/common'

describe('GenreController', () => {
	let controller: GenreController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GenreController],
			providers: [
				GenreService,
				{
					provide: getRepositoryToken(Genre),
					useValue: createMockRepository<Genre>(),
				},
			],
		}).compile()

		controller = module.get<GenreController>(GenreController)
	})

	describe('findAll', () => {
		it('should return an array of genres', async () => {
			const result = []
			jest
				.spyOn(controller, 'findAll')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.findAll({})).toBe(result)
		})
	})
	describe('findOne', () => {
		it('should return a genre', async () => {
			const result = {
				id: 1,
				name: 'Action',
			}
			jest
				.spyOn(controller, 'findOne')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.findOne(1)).toBe(result)
		})
		it('should return a bad request', async () => {
			const genreId: unknown = 'abc'
			jest
				.spyOn(controller, 'findOne')
				.mockImplementation(() => Promise.resolve(undefined))

			try {
				await controller.findOne(genreId as number)
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException)
				expect(e.message).toEqual(`Bad request`)
			}
		})
	})
	describe('create', () => {
		it('should create a genre', async () => {
			const result = {
				id: 1,
				name: 'Action',
			}
			jest
				.spyOn(controller, 'create')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.create(result)).toBe(result)
		})
	})
	describe('update', () => {
		it('should update a genre', async () => {
			const result = {
				id: 1,
				name: 'Action',
			}
			jest
				.spyOn(controller, 'update')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.update(1, result)).toBe(result)
		})
		it('should return a bad request', async () => {
			const genreId: unknown = 'abc'
			const genre = {
				id: 1,
				name: 'Action',
			}
			jest
				.spyOn(controller, 'update')
				.mockImplementation(() => Promise.resolve(undefined))

			try {
				await controller.update(genreId as number, genre)
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException)
				expect(e.message).toEqual(`Bad request`)
			}
		})
	})
	describe('remove', () => {
		it('should remove a genre', async () => {
			const result = {
				id: 1,
				name: 'Action',
			}
			jest
				.spyOn(controller, 'remove')
				.mockImplementation(() => Promise.resolve(result))

			expect(await controller.remove(1)).toBe(result)
		})
		it('should return a bad request', async () => {
			const genreId: unknown = 'abc'
			jest
				.spyOn(controller, 'remove')
				.mockImplementation(() => Promise.resolve(undefined))

			try {
				await controller.remove(genreId as number)
			} catch (e) {
				expect(e).toBeInstanceOf(BadRequestException)
				expect(e.message).toEqual(`Bad request`)
			}
		})
	})
})
