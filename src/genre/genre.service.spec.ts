import { Test, TestingModule } from '@nestjs/testing'
import { GenreService } from './genre.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Genre } from './entities/genre.entity'
import { NotFoundException } from '@nestjs/common'
import { createMockRepository, MockRepository } from '../mocks/repositoty.mock'

describe('GenreService', () => {
	let service: GenreService
	let genreRepository: MockRepository
	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GenreService,
				{
					provide: getRepositoryToken(Genre),
					useValue: createMockRepository<Genre>(),
				},
			],
		}).compile()

		service = module.get<GenreService>(GenreService)
		genreRepository = module.get(getRepositoryToken(Genre))
	})

	describe('findAll', () => {
		it('should return an array of genres', async () => {
			const expectedGenres = []
			genreRepository.find.mockResolvedValue(expectedGenres)

			const genres = await service.findAll({})

			expect(genres).toEqual(expectedGenres)
		})
	})
	describe('findOne', () => {
		describe('when genre with ID exists', () => {
			it('should return the genre', async () => {
				const genreId = 1
				const expectedGenre = {}
				genreRepository.findOne.mockResolvedValue(expectedGenre)

				const genre = await service.findOne(genreId)

				expect(genre).toEqual(expectedGenre)
			})
		})
		describe('otherwise', () => {
			it('when genre with ID does not exist', async () => {
				const genreId = 1
				genreRepository.findOne.mockResolvedValue(undefined)

				try {
					await service.findOne(genreId)
				} catch (e) {
					expect(e).toBeInstanceOf(NotFoundException)
					expect(e.message).toEqual(`Genre #${genreId} not found`)
				}
			})
		})
	})
	describe('create', () => {
		it('should create a new genre', async () => {
			const createGenreDto = { name: 'Action' }
			const expectedGenre = {}
			genreRepository.create.mockReturnValue(expectedGenre)
			genreRepository.save.mockResolvedValue(expectedGenre)

			const genre = await service.create(createGenreDto)

			expect(genreRepository.create).toHaveBeenCalledWith(createGenreDto)
			expect(genreRepository.save).toHaveBeenCalledWith(expectedGenre)
			expect(genre).toEqual(expectedGenre)
		})
	})
	describe('update', () => {
		describe('when genre with ID exists', () => {
			it('should update the genre', async () => {
				const genreId = 1
				const updateGenreDto = { name: 'Action' }
				const expectedGenre = {}
				genreRepository.preload.mockResolvedValue(expectedGenre)
				genreRepository.save.mockResolvedValue(expectedGenre)

				const genre = await service.update(genreId, updateGenreDto)

				expect(genreRepository.preload).toHaveBeenCalledWith({
					id: genreId,
					...updateGenreDto,
				})
				expect(genreRepository.save).toHaveBeenCalledWith(expectedGenre)
				expect(genre).toEqual(expectedGenre)
			})
		})
		describe('otherwise', () => {
			it('when genre with ID does not exist', async () => {
				const genreId = 1
				const updateGenreDto = { name: 'Action' }
				genreRepository.preload.mockResolvedValue(undefined)

				try {
					await service.update(genreId, updateGenreDto)
				} catch (e) {
					expect(e).toBeInstanceOf(NotFoundException)
					expect(e.message).toEqual(`Genre #${genreId} not found`)
				}
			})
		})
	})
	describe('remove', () => {
		describe('when genre with ID exists', () => {
			it('should remove the genre', async () => {
				const genreId = 1
				const expectedGenre = {}
				genreRepository.findOne.mockResolvedValue(expectedGenre)
				genreRepository.remove.mockResolvedValue(expectedGenre)

				const genre = await service.remove(genreId)

				expect(genreRepository.findOne).toHaveBeenCalledWith({
					where: { id: genreId },
				})
				expect(genreRepository.remove).toHaveBeenCalledWith(expectedGenre)
				expect(genre).toEqual(expectedGenre)
			})
		})
		describe('otherwise', () => {
			it('when genre with ID does not exist', async () => {
				const genreId = 1
				genreRepository.findOne.mockResolvedValue(undefined)

				try {
					await service.remove(genreId)
				} catch (e) {
					expect(e).toBeInstanceOf(NotFoundException)
					expect(e.message).toEqual(`Genre #${genreId} not found`)
				}
			})
		})
	})
})
