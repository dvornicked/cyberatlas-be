import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateGameDto {
	@ApiProperty({
		description: 'The name of the game',
		example: 'The Legend of Zelda: Breath of the Wild',
	})
	@IsString()
	readonly name: string

	@ApiProperty({
		description: 'The description of the game',
		example:
			'The Legend of Zelda: Breath of the Wild is an action-adventure game developed ' +
			'and published by Nintendo for the Nintendo Switch and Wii U video game consoles.',
	})
	@IsString()
	readonly description: string

	@ApiProperty({
		description: 'The image of the game',
		example:
			'https://upload.wikimedia.org/wikipedia/en/c/c6/The_Legend_of_Zelda_Breath_of_the_Wild.jpg',
	})
	@IsString()
	readonly image: string

	@IsString({ each: true })
	readonly genres: string[]
}
