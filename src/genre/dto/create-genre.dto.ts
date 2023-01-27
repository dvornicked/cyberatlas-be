import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateGenreDto {
	@ApiProperty({
		description: 'The name of the genre',
		example: 'Action',
	})
	@IsString()
	readonly name: string
}
