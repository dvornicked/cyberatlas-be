import { INestApplication, ValidationPipe } from '@nestjs/common'
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter'
import { GameModule } from '../../src/game/game.module'
import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as request from 'supertest'
import { GenreModule } from '../../src/genre/genre.module'

describe('[Feature] Game - /game', () => {
	let app: INestApplication

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
				}),
				TypeOrmModule.forRootAsync({
					imports: [ConfigModule],
					inject: [ConfigService],
					useFactory: (configService: ConfigService) => ({
						type: 'postgres',
						host: configService.get('TEST_DATABASE_HOST'),
						port: +configService.get('TEST_DATABASE_PORT'),
						username: configService.get('TEST_DATABASE_USER'),
						password: configService.get('TEST_DATABASE_PASSWORD'),
						database: configService.get('TEST_DATABASE_NAME'),
						clear: true,
						autoLoadEntities: true,
						synchronize: true,
					}),
				}),
				GameModule,
				GenreModule,
			],
		}).compile()
		app = moduleFixture.createNestApplication()
		app.useGlobalFilters(new HttpExceptionFilter())
		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				transform: true,
				forbidNonWhitelisted: true,
				transformOptions: {
					enableImplicitConversion: true,
				},
			}),
		)
		await app.init()
	})

	describe('Create [POST] /game', () => {
		it('should create a new game', async () => {
			const response = await request(app.getHttpServer())
				.post('/game')
				.send({
					name: 'Test Game',
					description: 'Test Game Description',
					image: 'image.jpg',
					genres: ['Action'],
				})
				.expect(201)
			expect(response.body).toMatchObject({
				id: 1,
				name: 'Test Game',
				description: 'Test Game Description',
				genres: [
					{
						id: 1,
						name: 'Action',
					},
				],
			})
		})
	})
	describe('Get All [GET] /game', () => {
		it('should get all games', async () => {
			const response = await request(app.getHttpServer())
				.get('/game')
				.expect(200)
			expect(response.body).toMatchObject([
				{
					id: 1,
					name: 'Test Game',
					description: 'Test Game Description',
					genres: [
						{
							id: 1,
							name: 'Action',
						},
					],
				},
			])
		})
	})
	describe('Get One [GET] /game/:id', () => {
		it('should get a game', async () => {
			const response = await request(app.getHttpServer())
				.get('/game/1')
				.expect(200)
			expect(response.body).toMatchObject({
				id: 1,
				name: 'Test Game',
				description: 'Test Game Description',
				genres: [
					{
						id: 1,
						name: 'Action',
					},
				],
			})
		})
	})
	describe('Update [PUT] /game/:id', () => {
		it('should update a game', async () => {
			const response = await request(app.getHttpServer())
				.patch('/game/1')
				.send({
					name: 'Test Game Updated',
					description: 'Test Game Description Updated',
					genres: ['Adventure'],
				})
				.expect(200)
			expect(response.body).toMatchObject({
				id: 1,
				name: 'Test Game Updated',
				description: 'Test Game Description Updated',
				genres: [
					{
						id: 2,
						name: 'Adventure',
					},
				],
			})
		})
	})
	describe('Delete [DELETE] /game/:id', () => {
		it('should delete a game', async () => {
			await request(app.getHttpServer()).delete('/game/1').expect(200)
			await request(app.getHttpServer()).get('/game/1').expect(404)
		})
	})
})
