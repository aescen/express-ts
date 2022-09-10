import shortid from 'shortid';

import debug from '../../utils/debug.util';

import CreateUserDto from '../dto/create.user.dto';
import UpdateUserDto from '../dto/update.user.dto';
import PatchUserDto from '../dto/patch.user.dto';

import UsersModel from '../models/users.model';

import PermissionFlag from '../../common/middleware/common.permission.flag.enum';

const log: debug.IDebugger = debug('app:mongodb-dao');

/**
 * UsersDao
 * DAO for users resource
 * @class UsersDao
 */
class UsersDao {
  #allowedPatchedFields: Array<string> = [
    'password',
    'firstName',
    'lastName',
    'permissionFlag',
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
  async addUser(userFields: CreateUserDto) {
    // eslint-disable-next-line no-param-reassign
    const userId = shortid.generate();
    const user = new UsersModel({
      _id: userId,
      ...userFields,
      permissionFlag: PermissionFlag.FREE_PERMISSION,
    });
    await user.save();
    return userId;
  }

  /**
   * getUsers
   * Get all users
   * @returns
   * @memberof UsersDao
   */
  async getUsers(limit = 25, page = 0) {
    return UsersModel.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  /**
   * getUserById
   * Get user by id
   * @param {string} userId
   * @returns
   * @memberof UsersDao
   */
  async getUserById(userId: string) {
    return UsersModel.findOne({ _id: userId }).exec();
  }

  /**
   * getUserByEmail
   * Get user by email
   * @param {string} email
   * @returns
   * @memberof UsersDao
   */
  async getUserByEmail(email: string) {
    return UsersModel.findOne({ email }).exec();
  }

  /**
   * getUserByEmailWithPassword
   * Get user with password by email
   * @param {string} email
   * @returns
   * @memberof UsersDao
   */
  async getUserByEmailWithPassword(email: string) {
    return UsersModel.findOne({ email })
      .select('_id email permissionFlag +password')
      .exec();
  }

  /**
   * updateUserById
   * Update user by id
   * @param {string} userId
   * @param {UpdateUserDto} newUser
   * @returns
   * @memberof UsersDao
   */
  async updateUserById(
    userId: string,
    userFields: UpdateUserDto | PatchUserDto,
  ) {
    const existingUser = UsersModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true },
    );

    return existingUser;
  }

  /**
   * deleteUserByUserId
   * Delete user by id
   * @param {string} userId
   * @returns
   * @memberof UsersDao
   */
  async deleteUserByUserId(userId: string) {
    return UsersModel.deleteOne({ _id: userId }).exec();
  }
}

export default new UsersDao();
