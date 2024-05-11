import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateProfileDto } from '../dtos/updateProfile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) public userRepository: Repository<User>,
  ) {}

  /**
   * The function fetches a user from the user repository based on their email and returns the user
   * object if found, otherwise returns null.
   * @param {string} email - The email parameter is a string that represents the email address of the
   * user you want to fetch.
   * @returns the user object if it exists, otherwise it returns null.
   */
  async fetchUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with that ${email} is not found`);
    }
    return {
      status: 200,
      message: 'success',
      data: {
        user,
      },
    };
  }

  /**
   * The function fetches a user from the user repository by their ID and returns the user object if
   * found, otherwise returns null.
   * @param {number} id - The `id` parameter is a string that represents the unique identifier
   * of a user.
   * @returns The function fetchUserById returns a Promise that resolves to the user object if found,
   * or null if the user is not found.
   */
  async fetchUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        userName: true,
        email: true,
        hashedRt: true,
        password: true,
        role: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUserField(
    id: number,
    fieldToUpdate: string,
    newValue: any,
  ): Promise<User | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        select: {
          id: true,
          userName: true,
          email: true,
          hashedRt: true,
          password: true,
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User doest not found'); // User not found
      }

      user[fieldToUpdate] = newValue;
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      // Handle potential errors or exceptions
      console.error(error);
      return undefined;
    }
  }
  //   a function to save user in db.
  async saveUser(user: Partial<User>): Promise<User | undefined> {
    try {
      const savedUser = await this.userRepository.save(user);
      return savedUser;
    } catch (error) {
      // Handle potential errors or exceptions
      console.error(error);
      return undefined;
    }
  }

  // a helper method to retrieve results from DB
  async fetchUsersByCriteria(criteria: FindOptionsWhere<User>) {
    const matchingUsers = await this.userRepository.find({
      where: criteria,
    });
    return matchingUsers;
  }

  async fetchUserByCriteria(
    field: keyof User,
    value: any,
  ): Promise<User | undefined> {
    if (field === 'password' || field === 'hashedRt') {
      throw new MethodNotAllowedException(
        'You are not allowed to execute this action',
      );
    }

    try {
      const user = await this.userRepository.findOne({
        where: { [field]: value },
      });
      if (!user) {
        throw new NotFoundException('No user found with this critera');
      }
      return user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    try {
      const user = await this.fetchUserById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const updatedUser = await this.userRepository.save({
        ...user,
        ...updateProfileDto,
      });
      delete updatedUser.password;
      delete updatedUser.hashedRt;
      return {
        status: 200,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser,
        },
      };
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
