// user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MenuItem } from './menuItem.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Restaurant {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  name: string;

  @ApiProperty({
    description: ' For example , Austin,Texas',
  })
  @Column()
  location: string;

  @ApiProperty()
  @Column({
    type: 'longtext',
  })
  review: string;

  @ApiProperty({ type: Number, format: 'float' }) // Explicitly specify the type and format
  @Column('float') // Define the column as a float in TypeORM
  rating: number;

  @ApiProperty({
    description:
      'A constant number between 1 to 4 while 4 being most expensive and 1 being least expensive ',
  })
  @Column()
  price: number;

  @ApiProperty({
    description: 'A stringified array that will be later parsed while fetching',
  })
  @Column({
    type: 'longtext',
  })
  features: string;

  @ApiProperty({
    description: 'A stringified array that will be later parsed while fetching',
  })
  @Column({
    type: 'longtext',
  })
  categories: string;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.restaurant)
  menuItems: MenuItem[];

  @ManyToOne(() => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
