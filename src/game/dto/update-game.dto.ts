import { CreateGameDto } from './create-game.dto'
import { PartialType } from '@nestjs/swagger'

export class UpdateGameDto extends PartialType(CreateGameDto) {}
