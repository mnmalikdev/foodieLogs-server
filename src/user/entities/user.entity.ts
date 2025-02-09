// user.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Role from '../enums/role';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { MenuItem } from 'src/restaurants/entities/menuItem.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  userName: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  password: string;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  hashedRt: string;

  @ApiProperty()
  @Column({
    default: Role.USER,
  })
  role: string;

  @OneToMany(() => Restaurant, (restaurant) => restaurant.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  restaurants: Restaurant[];

  // one user can have many favourite restaurants
  @OneToMany(() => Restaurant, (restaurant) => restaurant.favouritedByUser)
  favouriteRestaurants: Restaurant[];

  @ManyToMany(() => MenuItem, (menuItem) => menuItem.favoritedBy)
  favoriteMenuItems: MenuItem[];
}
