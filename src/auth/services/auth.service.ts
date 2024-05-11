import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import * as argon2 from 'argon2';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';
import { UpdatePasswordDto } from '../dtos/updatePassword.dto';
import Role from 'src/user/enums/role';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,
  ) {}

  // **************************** jwt based auth**********************************************************

  /**
   * The function "hashData" asynchronously hashes a given string using bcrypt with a cost factor of
   * 10.
   * @param {string} data - The `data` parameter is a string that represents the data that you want to
   * hash.
   * @returns a promise that resolves to the hashed version of the input data using bcrypt with a cost
   * factor of 10.
   */
  async hashData(data: string) {
    try {
      if (!data) {
        throw new Error('Invalid input for hashing');
      }
      return await argon2.hash(data, {
        type: argon2.argon2id,
        timeCost: 10,
        memoryCost: 2 ** 16,
        parallelism: 1,
      });
    } catch (error) {
      console.error('Hashing error:', error);
      throw new Error('Hashing failed');
    }
  }

  /**
   * The function `getTokens` generates an access token and a refresh token using the provided user ID,
   * email, and role.
   * @param {number} id - A unique identifier for the user.
   * @param {string} email - The `email` parameter is a string that represents the user's email
   * address.
   * @param {Role} role - The `role` parameter is a variable of type `Role`. It represents the role of
   * the user. The specific values that can be assigned to `role` depend on the implementation of the
   * `Role` type.
   * @returns The function `getTokens` returns an object with two properties: `access_token` and
   * `refresh_token`. The values of these properties are the generated access token (`at`) and refresh
   * token (`rt`) respectively.
   */
  async getTokens(id: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.sign(
        {
          sub: id,
          email,
        },
        {
          secret: process.env.AT_SECRET,
          expiresIn: '1h',
        },
      ),
      this.jwtService.sign(
        {
          sub: id,
          email,
        },
        {
          secret: process.env.RT_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);
    // generated rt and at tokens.
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  /**
   * The function updates the hashed refresh token value for a user in the database.
   * @param {number} id - A number representing the unique identifier of the user for whom the Rt
   * (refresh token) needs to be updated.
   * @param {string | null} rt - The `rt` parameter is a string that represents a refresh token. It can
   * either be a valid refresh token or `null` if the user does not have a refresh token.
   */

  async UpdateRtHash(id: number, rt: string | null) {
    const hashedRt = await this.hashData(rt);
    // Use the UserService to update the 'hashedRt' field
    await this.userService.updateUserField(id, 'hashedRt', hashedRt);
  }

  /**
   * The `signUpLocal` function checks if a user with the given email already exists, creates a new
   * user if not, hashes the password, sends a confirmation email, and saves the new user to the
   * database.
   * @param {SignUpDTO} signupDTO - The `signupDTO` parameter is an object that contains the following
   * properties:
   * @returns the newly created user object after saving it to the database.
   */
  async signUpLocal(signupDTO: SignupDto) {
    const existingUser = await this.userService.fetchUserByEmail(
      signupDTO?.email,
    );

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const newUser = new User();
    newUser.email = signupDTO?.email;
    newUser.userName = signupDTO?.userName;
    newUser.password = await this.hashData(signupDTO?.password);
    newUser.hashedRt = await this.hashData(signupDTO?.password);
    newUser.role = Role.USER;

    await this.userService.saveUser(newUser);

    //  write an api response as per apiresoponse type
    return {
      status: 200,
      message: 'User Created',
      data: {
        username: newUser?.userName,
        email: newUser?.email,
        role: newUser?.role,
      },
    };
  }

  /**
   * The function updates the password of a user by verifying the old password, hashing the new
   * password, and updating the user's password field in the database.
   * @param {number} userId - The userId parameter is the unique identifier of the user whose password
   * needs to be updated. It is of type number.
   * @param {UpdatePasswordDto} updatePasswordDto - The `updatePasswordDto` is an object that contains
   * the following properties:
   * @returns an object with two properties: "status" and "message". The "status" property has a value
   * of 200, indicating a successful operation, and the "message" property contains the string
   * "Password updated.".
   */
  async updatePassword(userId: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userService.fetchUserById(userId);
    if (!user) {
      throw new ForbiddenException('No such user exists ! ');
    }
    // match if old password is correct
    const passwordMatches = await argon2.verify(
      user.password,
      updatePasswordDto?.oldPassword,
    );

    if (!passwordMatches) {
      throw new ForbiddenException(
        'Old Password is incorrect ! Please try forget password option if you forgot your password',
      );
    }

    const hashedPassword = await this.hashData(updatePasswordDto?.newPassword);
    user.password = hashedPassword;
    await this.userService.updateUserField(user.id, 'password', hashedPassword);
    return {
      status: 200,
      message: 'Password updated.',
    };
  }

  /**
   * The logIn function checks if the provided fullName and password match, verifies if the user's
   * account is verified, generates tokens, updates the refresh token hash, and returns the tokens and
   * user information.
   * @param {LoginDto} loginDTO - The `loginDTO` parameter is an object that contains the following
   * properties:
   * @returns an object that contains the tokens and user information.
   */
  async logIn(loginDTO: LoginDto) {
    const user = await this.userService.fetchUserByCriteria(
      'email',
      loginDTO?.email,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatchs = await argon2.verify(
      user.password,
      loginDTO.password,
    );

    if (!passwordMatchs) {
      throw new ForbiddenException('email or Password incorrect');
    }

    const tokens = await this.getTokens(user.id, user.email);

    await this.UpdateRtHash(user.id, tokens.refresh_token);
    delete user.password;
    delete user.hashedRt;
    return {
      status: 200,
      message: 'User Created',
      data: {
        tokens: tokens,
        user,
      },
    };
  }

  //     // Save the updated user object
  /**
   * The function `refreshTokens` fetches a user by their ID, verifies the provided refresh token,
   * generates new tokens, updates the refresh token in the database, and returns the new tokens along
   * with the user details.
   * @param {number} id - The `id` parameter is the unique identifier of the user for whom we want to
   * refresh the tokens. It is of type `number`.
   * @param {string} refreshToken - A string representing the refresh token used for authentication and
   * authorization.
   * @returns an object with two properties: "newTokens" and "userDetails".
   */
  async refreshTokens(id: number, refreshToken: string) {
    try {
      const user = await this.userService.fetchUserById(id);

      if (!user) {
        throw new NotFoundException('user not found');
      }

      const rtMatches = await argon2.verify(user.hashedRt, refreshToken);

      if (!rtMatches) {
        throw new ForbiddenException('Access Denied !!');
      }

      const newTokens = await this.getTokens(user.id, user.email);
      // update refresh token in db
      await this.UpdateRtHash(user.id, newTokens.refresh_token);

      return {
        newTokens,
        userDetails: user,
      };
    } catch (e) {
      throw new InternalServerErrorException('Error Occured. Please try again');
    }
  }

  /**
   * The function logs out a user by updating their hashed refresh token to null.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a
   * user.
   * @returns the result of the `this.userService.updateUserField` method call.
   */
  async Logout(id: number) {
    const user = await this.userService.fetchUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.hashedRt !== null) {
      return await this.userService.updateUserField(id, 'hashedRt', null);
    }

    return {
      status: 200,
      message: 'User Logged Out',
    };
  }
}
