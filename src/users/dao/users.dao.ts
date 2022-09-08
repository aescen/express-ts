import shortid from 'shortid';
import debug from 'debug';

import CreateUserDto from '../dto/create.user.dto';
import UpdateUserDto from '../dto/update.user.dto';
import PatchUserDto from '../dto/patch.user.dto';

const log: debug.IDebugger = debug('app:in-memory-dao');

/**
 * UsersDao
 * DAO for users resource
 * @class UsersDao
 */
class UsersDao {
  #users: Array<CreateUserDto> = [];

  #allowedPatchedFields: Array<string> = [
    'password',
    'firstName',
    'lastName',
    'permissionLevel',
  ];

  constructor() {
    log('created a new instance of UsersDao');
  }

  /**
   * #getPatchedUser
   * Private method to get patched user resource
   * @param {PatchUserDto} user
   * @returns
   * @memberof UsersDao
   */
  #getPatchedUser(currentUser: UpdateUserDto, user: PatchUserDto) {
    for (let i = 0; i < this.#allowedPatchedFields.length; i += 1) {
      const field = this.#allowedPatchedFields[i];
      if (field in user) {
        // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-explicit-any
        (currentUser as any)[field] = (user as any)[field];
      }
    }

    return currentUser;
  }

  /**
   * addUser
   * Create a new user from resource
   * @param {CreateUserDto} user
   * @returns
   * @memberof UsersDao
   */
  async addUser(user: CreateUserDto) {
    // eslint-disable-next-line no-param-reassign
    user.id = shortid.generate();
    this.#users.push(user);
    return user.id;
  }

  /**
   * getUsers
   * Get all users
   * @returns
   * @memberof UsersDao
   */
  async getUsers() {
    return this.#users;
  }

  /**
   * getUserById
   * Get user by id
   * @param {string} userId
   * @returns
   * @memberof UsersDao
   */
  async getUserById(userId: string) {
    return (
      this.#users.find((user: { id: string }) => user.id === userId) ?? null
    );
  }

  /**
   * getUserByEmail
   * Get user by email
   * @param {string} email
   * @returns
   * @memberof UsersDao
   */
  async getUserByEmail(email: string) {
    return (
      this.#users.find((user: { email: string }) => user.email === email) ??
      null
    );
  }

  /**
   * updateUserById
   * Update user by id
   * @param {string} userId
   * @param {UpdateUserDto} newUser
   * @returns
   * @memberof UsersDao
   */
  async updateUserById(userId: string, newUser: UpdateUserDto) {
    const userIndex = this.#users.findIndex(
      (user: { id: string }) => user.id === userId,
    );
    this.#users.splice(userIndex, 1, newUser);

    return `${userId} updated via put`;
  }

  /**
   * partialUpdateUserById
   * Partially update user by id
   * @param {string} userId
   * @param {PatchUserDto} newUser
   * @returns
   * @memberof UsersDao
   */
  async partialUpdateUserById(userId: string, newUser: PatchUserDto) {
    const userIndex = this.#users.findIndex(
      (user: { id: string }) => user.id === userId,
    );
    const currentUser = this.#users[userIndex];
    const user = this.#getPatchedUser(currentUser, newUser);

    this.#users.splice(userIndex, 1, user);
    return `${userId} patched`;
  }

  /**
   * deleteUserByUserId
   * Delete user by id
   * @param {string} userId
   * @returns
   * @memberof UsersDao
   */
  async deleteUserByUserId(userId: string) {
    const userIndex = this.#users.findIndex(
      (user: { id: string }) => user.id === userId,
    );
    this.#users.splice(userIndex, 1);

    return `${userId} deleted`;
  }
}

export default new UsersDao();
