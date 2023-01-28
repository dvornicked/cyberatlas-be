import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Game } from '../../game/entities/game.entity'

@Entity()
export class Genre {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@ManyToMany(() => Game, game => game.genres)
	games: Game[]
}
