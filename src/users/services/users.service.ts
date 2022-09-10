import UsersDao from '../dao/users.dao';
import CreateUserDto from '../dto/create.user.dto';
import UpdateUserDto from '../dto/update.user.dto';
import PatchUserDto from '../dto/patch.user.dto';
import CRUD from '../../common/crud.interface';

/**
 * UsersService
 * Service that calls CRUD function for users resource
 * @class UsersService
 * @implements {CRUD}
 */
class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return UsersDao.addUser(resource);
  }

  /**
   * list
   * Get all users
   * @param {number} limit
   * @param {number} page
   * @returns
   * @memberof UsersService
   */
  async list(limit: number, page: number) {
    return UsersDao.getUsers(limit, page);
  }

  /**
   * readById
   * Get user by id
   * @param {string} id
   * @returns
   * @memberof UsersService
   */
  async readById(id: string) {
    return UsersDao.getUserById(id);
  }

  /**
   * readByEmail
   * Get user by email
   * @param {string} email
   * @returns
   * @memberof UsersService
   */
  async readByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }

  /**
   * readByEmailWithPassword
   * Get user with password by email
   * @param {string} email
   * @returns
   * @memberof UsersService
   */
  async readByEmailWithPassword(email: string) {
    return UsersDao.getUserByEmailWithPassword(email);
  }

  /**
   * updateById
   * Update user by id
   * @param {string} id
   * @param {UpdateUserDto} resource
   * @returns
   * @memberof UsersService
   */
  async updateById(id: string, resource: UpdateUserDto) {
    return UsersDao.updateUserById(id, resource);
  }

  /**
   * partialUpdateById
   * Partial update user by id
   * @param {string} id
   * @param {PatchUserDto} resource
   * @returns
   * @memberof UsersService
   */
  async partialUpdateById(id: string, resource: PatchUserDto) {
    return UsersDao.updateUserById(id, resource);
  }

  /**
   * deleteById
   * Delete user by id
   * @param {string} id
   * @returns
   * @memberof UsersService
   */
  async deleteById(id: string) {
    return UsersDao.deleteUserByUserId(id);
  }
}

export default new UsersService();
