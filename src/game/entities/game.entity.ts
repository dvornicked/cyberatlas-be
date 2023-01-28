import {
	Column,
	Entity,
	Index,
	ManyToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { JoinTable } from 'typeorm'
import { Genre } from '../../genre/entities/genre.entity'

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number

	@Index()
	@Column()
	name: string

	@Column()
	description: string

	@Column()
	image: string

	@JoinTable()
	@ManyToMany(() => Genre, genre => genre.games, { cascade: true })
	genres: Genre[]

	// price: number
	// rating: number
	// releaseDate: Date
	// developer: string
	// publisher: string
	// platforms: string[]
}
