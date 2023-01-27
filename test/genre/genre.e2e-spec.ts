import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { GenreModule } from '../../src/genre/genre.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as request from 'supertest'
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter'
import { ConfigModule, ConfigService } from '@nestjs/config'

describe('[Feature] Genre - /genre', () => {
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

	describe('Create [POST] /genre', () => {
		it('should create a new genre', async () => {
			const response = await request(app.getHttpServer())
				.post('/genre')
				.send({
					name: 'Test Genre',
				})
				.expect(201)
			expect(response.body).toMatchObject({
				id: expect.any(Number),
				name: 'Test Genre',
			})
		})
	})
	describe('Get All [GET] /genre', () => {
		it('should return an array of genres', async () => {
			const response = await request(app.getHttpServer())
				.get('/genre')
				.expect(200)
			expect(response.body).toBeInstanceOf(Array)
			expect(response.body[0]).toMatchObject({
				id: 1,
				name: 'Test Genre',
			})
		})
	})
	describe('Get One [GET] /genre/:id', () => {
		it('should return a genre', async () => {
			const response = await request(app.getHttpServer())
				.get('/genre/1')
				.expect(200)
			expect(response.body).toMatchObject({
				id: 1,
				name: 'Test Genre',
			})
		})
	})
	describe('Update [PUT] /genre/:id', () => {
		it('should update a genre', async () => {
			const response = await request(app.getHttpServer())
				.patch('/genre/1')
				.send({
					name: 'Updated Test Genre',
				})
				.expect(200)
			expect(response.body).toMatchObject({
				id: 1,
				name: 'Updated Test Genre',
			})
		})
	})

	describe('Delete [DELETE] /genre/:id', () => {
		it('should delete a genre', async () => {
			const response = await request(app.getHttpServer())
				.delete('/genre/1')
				.expect(200)
			expect(response.body).toMatchObject({
				name: 'Updated Test Genre',
			})
		})
	})

	afterAll(async () => {
		await app.close()
	})
})
