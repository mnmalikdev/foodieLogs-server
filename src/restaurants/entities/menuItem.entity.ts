import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class MenuItem {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  name: string;

  @ApiProperty()
  @Column({
    type: 'longtext',
  })
  review: string;

  @ApiProperty({ type: Number, format: 'float' }) // Explicitly specify the type and format
  @Column('float')
  rating: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  restaurant: Restaurant;

  @ManyToMany(() => User, (user) => user.favoriteMenuItems)
  @JoinTable()
  favoritedBy: User[];
}
